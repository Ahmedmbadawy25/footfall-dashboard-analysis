const asyncHandler = require('express-async-handler');
const Footfall = require('../models/Footfall');
const Store = require("../models/Store");

const postData = asyncHandler(async (req, res) => {
    const data = req.body
    console.log(req.body)
    await Footfall.insertMany(data)
  
    res.status(200).json({ message: 'data inserted successfullyyyy' });
});

const getStoresPageWidgetsData = asyncHandler(async (req, res) => {
    try {
      const egyptTime = new Date();
      egyptTime.setHours(0, 0, 0, 0); // Start of today
  
      const yesterdayTime = new Date(egyptTime);
      yesterdayTime.setDate(yesterdayTime.getDate() - 1); // Start of yesterday
  
      // Query footfall entries for today
      const todayFootfall = await Footfall.find({ timestamp: { $gte: egyptTime } });
  
      // Query footfall entries for yesterday
      const yesterdayFootfall = await Footfall.find({ timestamp: { $gte: yesterdayTime, $lt: egyptTime } });
  
      // Get all store IDs and names from the store collection
      const allStores = await Store.find({}, "_id name");
      const storeMap = {}; // Map store_id to store name
      allStores.forEach(store => {
        storeMap[store._id.toString()] = store.name;
      });
  
      // Group today's footfall by store_id
      const storeFootfallCounts = {};
      todayFootfall.forEach(entry => {
        storeFootfallCounts[entry.store_id] = (storeFootfallCounts[entry.store_id] || 0) + 1;
      });
  
      // Calculate total footfall today
      const totalFootfallToday = todayFootfall.length;
    
      // Compute average footfall per store
      const averageFootfallPerStore = Math.round(totalFootfallToday / allStores.length);
  
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
        const visits = storeFootfallCounts[store._id.toString()] || 0; // Default to 0 if no visits
        if (visits < leastVisits) {
          leastVisits = visits;
          leastVisitedStoreId = store._id.toString();
        }
      });
      const leastVisitedStore = leastVisitedStoreId ? storeMap[leastVisitedStoreId] : "N/A";
  
      // Calculate store footfall growth percentage compared to yesterday
      const storeGrowth = {};
      todayFootfall.forEach(entry => {
        storeGrowth[entry.store_id] = (storeGrowth[entry.store_id] || 0) + 1;
      });
      yesterdayFootfall.forEach(entry => {
        storeGrowth[entry.store_id] = (storeGrowth[entry.store_id] || 0) - 1;
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
  
      res.status(200).json({
        totalFootfallToday,
        averageFootfallPerStore,
        mostVisitedStore,
        leastVisitedStore,
        mostGrowthStore,
      });
    } catch (error) {
      console.error("Error fetching footfall data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    postData,
    getStoresPageWidgetsData,
};