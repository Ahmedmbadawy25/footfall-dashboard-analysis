const asyncHandler = require('express-async-handler');
const Footfall = require('../models/Footfall');
const Store = require("../models/Store");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 30 }); // Cache for 5 mins
const moment = require('moment-timezone')

const postData = asyncHandler(async (req, res) => {
    const data = req.body
    console.log(req.body)
    await Footfall.insertMany(data)
  
    res.status(200).json({ message: 'data inserted successfullyyyy' });
});

const getStoresPageWidgetsData = asyncHandler(async (req, res) => {
    try {
        const cachedData = cache.get("storesWidgetData");
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        // Get the current date in Egypt timezone and reset time to start of the day
        const egyptTime = moment.tz("Africa/Cairo").startOf("day").toDate();
        const yesterdayTime = moment.tz("Africa/Cairo").subtract(1, "day").startOf("day").toDate();

        // Query footfall entries for today
        const todayFootfall = await Footfall.find({
            timestamp: { $gte: egyptTime }
        });

        // Query footfall entries for yesterday
        const yesterdayFootfall = await Footfall.find({
            timestamp: { $gte: yesterdayTime, $lt: egyptTime }
        });

        // Get all store IDs and names from the store collection
        const allStores = await Store.find({}, "_id name");
        const storeMap = {};
        allStores.forEach(store => {
            storeMap[store._id.toString()] = store.name;
        });

        // Group today's footfall by store_id
        const storeFootfallCounts = {};
        todayFootfall.forEach(entry => {
            const storeId = entry.store_id.toString();
            storeFootfallCounts[storeId] = (storeFootfallCounts[storeId] || 0) + 1;
        });

        // Calculate total footfall today
        const totalFootfallToday = todayFootfall.length;

        // Compute average footfall per store
        const averageFootfallPerStore = allStores.length > 0
            ? Math.round(totalFootfallToday / allStores.length)
            : 0;

        // Find the store with the most visits
        let mostVisitedStoreId = null;
        let mostVisits = 0;
        for (const storeId in storeFootfallCounts) {
            if (storeFootfallCounts[storeId] > mostVisits) {
                mostVisits = storeFootfallCounts[storeId];
                mostVisitedStoreId = storeId;
            }
        }
        const mostVisitedStore = mostVisitedStoreId ? storeMap[mostVisitedStoreId] : "N/A";

        // Find the store with the least visits (including stores with 0 visits)
        let leastVisitedStoreId = null;
        let leastVisits = Infinity;
        allStores.forEach(store => {
            const visits = storeFootfallCounts[store._id.toString()] || 0;
            if (visits < leastVisits) {
                leastVisits = visits;
                leastVisitedStoreId = store._id.toString();
            }
        });
        const leastVisitedStore = leastVisitedStoreId ? storeMap[leastVisitedStoreId] : "N/A";

        // Calculate store footfall growth percentage compared to yesterday
        const storeGrowth = {};
        todayFootfall.forEach(entry => {
            const storeId = entry.store_id.toString();
            storeGrowth[storeId] = (storeGrowth[storeId] || 0) + 1;
        });
        yesterdayFootfall.forEach(entry => {
            const storeId = entry.store_id.toString();
            storeGrowth[storeId] = (storeGrowth[storeId] || 0) - 1;
        });

        let mostGrowthStoreId = null;
        let maxGrowth = -Infinity;
        for (const storeId in storeGrowth) {
            const growth = storeGrowth[storeId];
            if (growth > maxGrowth) {
                maxGrowth = growth;
                mostGrowthStoreId = storeId;
            }
        }
        const mostGrowthStore = mostGrowthStoreId ? storeMap[mostGrowthStoreId] : "N/A";

        const result = { 
            totalFootfallToday, 
            averageFootfallPerStore, 
            mostVisitedStore, 
            leastVisitedStore, 
            mostGrowthStore 
        };

        // Cache the result
        cache.set("storesWidgetData", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching footfall data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const getDashboardWidgetsData = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req.params;
        const cacheKey = `dashboardWidgetData_${storeId}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        // Ensure start times are correctly adjusted to Cairo time
        const cairoTZ = "Africa/Cairo";
        const startOfToday = moment.tz(cairoTZ).startOf("day").toDate(); 
        const startOfWeek = moment.tz(cairoTZ).startOf("week").toDate();

        // Fetch footfall data using correct Cairo time range
        const todayFootfall = await Footfall.find({ 
            store_id: storeId, 
            timestamp: { $gte: startOfToday } 
        });

        const pastWeekFootfall = await Footfall.find({ 
            store_id: storeId, 
            timestamp: { $gte: startOfWeek } 
        });

        // Compute footfall stats
        const totalFootfallToday = todayFootfall.length;
        const totalFootfallThisWeek = pastWeekFootfall.length;

        // Process footfall per hour
        const hourlyFootfall = new Array(24).fill(0);
        todayFootfall.forEach(entry => {
            const hour = moment(entry.timestamp).tz(cairoTZ).hour();  // Convert to Cairo hour
            hourlyFootfall[hour]++;
        });

        // Compute footfall per day
        const dailyFootfall = new Array(7).fill(0);
        pastWeekFootfall.forEach(entry => {
            const day = moment(entry.timestamp).tz(cairoTZ).day(); // Convert to Cairo day
            dailyFootfall[day]++;
        });

        if (totalFootfallThisWeek === 0) {
            return res.status(200).json({
                totalFootfallToday,
                busiestHourToday: "N/A",
                quietestHourToday: "N/A",
                busiestDayThisWeek: "N/A",
                quietestDayThisWeek: "N/A",
                totalFootfallThisWeek,
                hourlyFootfall,
                dailyFootfall
            });
        }

        // Find busiest/quietest days
        let busiestDayThisWeek = 0, quietestDayThisWeek = 0;
        let maxDayCount = 0, minDayCount = Infinity;

        dailyFootfall.forEach((count, day) => {
            if (count > maxDayCount) {
                maxDayCount = count;
                busiestDayThisWeek = day;
            }
            if (count < minDayCount) {
                minDayCount = count;
                quietestDayThisWeek = day;
            }
        });

        // Map day numbers to string names
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        busiestDayThisWeek = dayNames[busiestDayThisWeek];
        quietestDayThisWeek = dayNames[quietestDayThisWeek];

        if (totalFootfallToday === 0) {
            return res.status(200).json({
                totalFootfallToday,
                busiestHourToday: "N/A",
                quietestHourToday: "N/A",
                busiestDayThisWeek,
                quietestDayThisWeek,
                totalFootfallThisWeek,
                hourlyFootfall,
                dailyFootfall
            });
        }

        // Find busiest/quietest hours
        let busiestHourToday = null, quietestHourToday = null;
        let maxHourCount = 0, minHourCount = Infinity;
        
        hourlyFootfall.forEach((count, hour) => {
            if (count > maxHourCount) {
                maxHourCount = count;
                busiestHourToday = hour;
            }
            if (count < minHourCount && count > 0) {  // Only consider hours that had visits
                minHourCount = count;
                quietestHourToday = hour;
            }
        });

        // Format hours as ranges
        const formatHourRange = (hour) => {
            if (hour === null || hour === undefined) return "N/A";
            if (hour < 0 || hour >= 24) return "Out of range";
        
            const nextHour = (hour + 1) % 24; // Wrap around to 00 if hour is 23
        
            return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
        };

        // Send final response
        const result = { 
            totalFootfallToday, 
            busiestHourToday: formatHourRange(busiestHourToday), 
            quietestHourToday: formatHourRange(quietestHourToday),
            busiestDayThisWeek, 
            quietestDayThisWeek,
            totalFootfallThisWeek,
            hourlyFootfall,
            dailyFootfall
        };

        cache.set(cacheKey, result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching footfall data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    postData,
    getStoresPageWidgetsData,
    getDashboardWidgetsData,
};