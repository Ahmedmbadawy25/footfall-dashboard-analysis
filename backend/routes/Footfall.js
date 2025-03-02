const express = require('express');
const router = express.Router();
const footfallController = require('../controllers/Footfall');
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

router.get("/stores-page-widgets-data", verifyToken, footfallController.getStoresPageWidgetsData);
router.get("/dashboard-widgets-data/:storeId", verifyToken, footfallController.getDashboardWidgetsData);
router.get("/forecast/:storeId", verifyToken, footfallController.getFootfallForecast);


// router.get("/hourly-total/:hour/:day/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getHourlyFootfallCount);
// router.get("/total/day/::day/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getTotalEntriesForDay);
// router.get("/busiest-least-hour/:day/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getBusiestAndLeastBusyHourOfDay);
// router.get("/hourly/::day/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getHourlyFootfallForDay);
// router.get("/daily/:week/:year", verifyToken, authorizeRoles['admin'], footfallController.getDailyFootfallForWeek);
// router.get("/busiest-least-day/:week/:year", verifyToken, authorizeRoles['admin'], footfallController.getBusiestAndLeastBusyDayOfWeek);
// router.get("/total/week/:week/:year", verifyToken, authorizeRoles['admin'], footfallController.getTotalFootfallForWeek);
// router.get("/average/week/:week/:year", verifyToken, authorizeRoles['admin'], footfallController.getAverageDailyFootfallForWeek);
// router.get("/compare-day/:date1/:date2", verifyToken, authorizeRoles['admin'], footfallController.compareFootfallBetweenDates);
// router.get("/compare-week/:week1/:year1/:week2/:year2", verifyToken, authorizeRoles['admin'], footfallController.compareWeeklyFootfall);
// router.get("/summary/daily/:day/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getDailySummary);
// router.get("/summary/weekly/:week/:year", verifyToken, authorizeRoles['admin'], footfallController.getWeeklySummary);
// router.get("/summary/monthly/:month/:year", verifyToken, authorizeRoles['admin'], footfallController.getMonthlySummary);

module.exports = router;