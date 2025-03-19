const asyncHandler = require('express-async-handler');
const Footfall = require('../models/Footfall');
const Store = require("../models/Store");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 30 }); // Cache for 5 mins
const forecastCache = new NodeCache({ stdTTL: 60 * 60 }); // Cache for 1 hour
const moment = require('moment-timezone')


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

        const cairoTZ = "Africa/Cairo";
        const startOfToday = moment.tz(cairoTZ).startOf("day").toDate();
        const startOfWeek = moment.tz(cairoTZ).startOf("week").toDate();
        const startOfMonth = moment.tz(cairoTZ).startOf("month").toDate();
        const startOfPreviousWeek = moment(startOfWeek).subtract(7, "days").toDate();
        const startOfPreviousMonth = moment(startOfMonth).subtract(1, "month").toDate();

        // Fetch Footfall Data
        const todayFootfall = await Footfall.find({ store_id: storeId, timestamp: { $gte: startOfToday } });
        const pastWeekFootfall = await Footfall.find({ store_id: storeId, timestamp: { $gte: startOfWeek } });
        const pastMonthFootfall = await Footfall.find({ store_id: storeId, timestamp: { $gte: startOfMonth } });
        const previousWeekFootfall = await Footfall.find({ store_id: storeId, timestamp: { $gte: startOfPreviousWeek, $lt: startOfWeek } });
        const previousMonthFootfall = await Footfall.find({ store_id: storeId, timestamp: { $gte: startOfPreviousMonth, $lt: startOfMonth } });

        // Compute Footfall Counts
        const totalFootfallToday = todayFootfall.length;
        const totalFootfallThisWeek = pastWeekFootfall.length;
        const totalFootfallThisMonth = pastMonthFootfall.length;
        const totalFootfallPreviousWeek = previousWeekFootfall.length;
        const totalFootfallPreviousMonth = previousMonthFootfall.length;

        // Compute Percentage Change
        const weeklyFootfallChange = totalFootfallPreviousWeek === 0 ? 100 : ((totalFootfallThisWeek - totalFootfallPreviousWeek) / totalFootfallPreviousWeek) * 100;
        const monthlyFootfallChange = totalFootfallPreviousMonth === 0 ? 100 : ((totalFootfallThisMonth - totalFootfallPreviousMonth) / totalFootfallPreviousMonth) * 100;

        // Compute Hourly and Daily Footfall
        const hourlyFootfall = new Array(24).fill(0);
        todayFootfall.forEach(entry => {
            const hour = moment(entry.timestamp).tz(cairoTZ).hour();
            hourlyFootfall[hour]++;
        });

        const dailyFootfall = new Array(7).fill(0);
        pastWeekFootfall.forEach(entry => {
            const day = moment(entry.timestamp).tz(cairoTZ).day();
            dailyFootfall[day]++;
        });

        const dailyFootfallPreviousWeek = new Array(7).fill(0);
        previousWeekFootfall.forEach(entry => {
            const day = moment(entry.timestamp).tz(cairoTZ).day();
            dailyFootfallPreviousWeek[day]++;
        });

        // Find Busiest/Quietest Times
        const findBusiestQuietest = (data) => {
            let busiest = { time: "N/A", count: 0 };
            let quietest = { time: "N/A", count: Infinity };

            data.forEach((count, index) => {
                if (count > busiest.count) busiest = { time: index, count };
                if (count < quietest.count && count > 0) quietest = { time: index, count };
            });

            return {
                busiest: busiest.count === 0 ? "N/A" : busiest.time,
                quietest: quietest.count === Infinity ? "N/A" : quietest.time,
            };
        };

        const { busiest: busiestHourToday, quietest: quietestHourToday } = findBusiestQuietest(hourlyFootfall);
        const { busiest: busiestDayThisWeek, quietest: quietestDayThisWeek } = findBusiestQuietest(dailyFootfall);

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const busiestDayName = dayNames[busiestDayThisWeek] || "N/A";
        const quietestDayName = dayNames[quietestDayThisWeek] || "N/A";

        // Find Typical Busiest Hour for Today's Weekday
        const currentWeekday = moment().tz(cairoTZ).day(); // Get today's day index (0=Sunday, 6=Saturday)
        const pastWeeksFootfallForDay = await Footfall.find({
            store_id: storeId,
            timestamp: {
                $gte: moment().tz(cairoTZ).subtract(4, "weeks").startOf("week").toDate()
            }
        });

        const hourlyAggregated = new Array(24).fill(0);
        let countEntries = 0;

        pastWeeksFootfallForDay.forEach(entry => {
            if (moment(entry.timestamp).tz(cairoTZ).day() === currentWeekday) {
                const hour = moment(entry.timestamp).tz(cairoTZ).hour();
                hourlyAggregated[hour]++;
                countEntries++;
            }
        });

        const typicalBusiestHourIndex = hourlyAggregated.indexOf(Math.max(...hourlyAggregated));
        const typicalBusiestHour = countEntries > 0 ? `${typicalBusiestHourIndex}:00 - ${typicalBusiestHourIndex + 1}:00` : "N/A";

        // Find Typical Busiest Day of the Week
        const weeklyAggregated = new Array(7).fill(0);
        pastWeeksFootfallForDay.forEach(entry => {
            const day = moment(entry.timestamp).tz(cairoTZ).day();
            weeklyAggregated[day]++;
        });

        const typicalBusiestDayIndex = weeklyAggregated.indexOf(Math.max(...weeklyAggregated));
        const typicalBusiestDay = typicalBusiestDayIndex !== -1 ? `${dayNames[typicalBusiestDayIndex]} (${weeklyAggregated[typicalBusiestDayIndex]} visits)` : "N/A";

        // Compute Busiest Week of the Current Month
        const weeksInMonth = [];
        let currentWeek = moment(startOfMonth).tz(cairoTZ).startOf("week");

        while (currentWeek.isBefore(moment().tz(cairoTZ))) {
            const startOfWeek = currentWeek.clone().toDate();
            const endOfWeek = currentWeek.clone().endOf("week").toDate();

            const weekFootfall = await Footfall.countDocuments({
                store_id: storeId,
                timestamp: { $gte: startOfWeek, $lte: endOfWeek },
            });

            weeksInMonth.push({ weekLabel: `Week ${weeksInMonth.length + 1}`, count: weekFootfall });
            currentWeek.add(1, "week");
        }

        weeksInMonth.sort((a, b) => b.count - a.count);
        const busiestWeek = weeksInMonth.length ? `${weeksInMonth[0].weekLabel} (${weeksInMonth[0].count} visits)` : "N/A";

        // Summary Data

        // Summary Data
        const summary = {
            daily: {
                total: totalFootfallToday,
                busiestHour: busiestHourToday !== "N/A" ? `${busiestHourToday}:00 - ${busiestHourToday + 1}:00` : "N/A",
                visitorChange: totalFootfallPreviousWeek > 0 ? `${weeklyFootfallChange.toFixed(1)}%` : "No data",
                typicalBusiestHour
            },
            weekly: {
                total: totalFootfallThisWeek,
                busiestDay: busiestDayName,
                visitorChange: `${weeklyFootfallChange.toFixed(1)}% vs last week`,
                typicalBusiestDay
            },
            monthly: {
                total: totalFootfallThisMonth,
                visitorChange: `${monthlyFootfallChange.toFixed(1)}% vs last month`,
                busiestWeek
            },
        };

        // Response Data
        const result = { 
            totalFootfallToday, 
            busiestHourToday: busiestHourToday !== "N/A" ? `${busiestHourToday}:00 - ${busiestHourToday + 1}:00` : "N/A",
            quietestHourToday: quietestHourToday !== "N/A" ? `${quietestHourToday}:00 - ${quietestHourToday + 1}:00` : "N/A",
            busiestDayThisWeek: busiestDayName, 
            quietestDayThisWeek: quietestDayName,
            totalFootfallThisWeek,
            hourlyFootfall,
            dailyFootfall,
            totalFootfallPreviousWeek,
            dailyFootfallPreviousWeek,
            weeklyFootfallChange,
            summary
        };

        cache.set(cacheKey, result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching footfall data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const holtWinters = (data, alpha = 0.3, beta = 0.1, gamma = 0.3, seasonLength = 7, forecastSteps = 1, multiplicative = false) => {
    if (data.length < seasonLength) throw new Error("Not enough data points for seasonality.");

    let level = [data[0]];
    let trend = [(data[1] - data[0]) / seasonLength];
    let season = data.slice(0, seasonLength).map((val, i) => val - data[i % seasonLength]);

    for (let i = 1; i < data.length; i++) {
        const prevLevel = level[i - 1];
        const prevTrend = trend[i - 1];
        const prevSeason = season[i % seasonLength];

        let newLevel = alpha * (data[i] - prevSeason) + (1 - alpha) * (prevLevel + prevTrend);
        let newTrend = beta * (newLevel - prevLevel) + (1 - beta) * prevTrend;
        let newSeason = gamma * (data[i] - newLevel) + (1 - gamma) * prevSeason;

        if (multiplicative) {
            newSeason = gamma * (data[i] / Math.max(newLevel, 1)) + (1 - gamma) * prevSeason;
        }

        level.push(Math.max(newLevel, 0)); // Ensure non-negative level
        trend.push(newTrend);
        season[i % seasonLength] = newSeason;
    }

    let forecast = [];
    for (let i = 1; i <= forecastSteps; i++) {
        let futureLevel = level[level.length - 1] + i * trend[trend.length - 1];
        let futureSeason = season[(data.length + i) % seasonLength];

        let predicted = multiplicative ? futureLevel * futureSeason : futureLevel + futureSeason;
        forecast.push(Math.max(Math.round(predicted), 0)); // Clamp negatives to 0
    }

    return forecast.length === 1 ? forecast[0] : forecast;
};

const getFootfallForecast = asyncHandler(async (req, res) => {
    try {
        const { storeId } = req.params;
        const cacheKey = `forecastData_${storeId}`;
        const cachedData = forecastCache.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const cairoTZ = "Africa/Cairo";

        // Fetch historical footfall data
        const historicalFootfall = await Footfall.find({ store_id: storeId });

        // Handle missing (0 visit) days
        const startDate = moment(historicalFootfall[0].timestamp).tz(cairoTZ).startOf('day');
        const endDate = moment().tz(cairoTZ).startOf('day');
        let dailyCounts = {};

        for (let date = startDate.clone(); date.isBefore(endDate); date.add(1, 'day')) {
            dailyCounts[date.format("YYYY-MM-DD")] = 0;
        }

        historicalFootfall.forEach(entry => {
            const day = moment(entry.timestamp).tz(cairoTZ).format("YYYY-MM-DD");
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });

        // Convert to sorted arrays
        const sortedDailyCounts = Object.entries(dailyCounts).sort((a, b) => moment(a[0]).diff(moment(b[0])));
        const footfallDailyData = sortedDailyCounts.map(entry => entry[1]);

        // Apply Holt-Winters for daily predictions (next 7 days)
        const dailyPredictions = holtWinters(footfallDailyData, 0.3, 0.1, 0.3, 7, 7);

        const result = {
            dailyPredictions
        };

        forecastCache.set(cacheKey, result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching footfall forecast data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    getStoresPageWidgetsData,
    getDashboardWidgetsData,
    getFootfallForecast
};