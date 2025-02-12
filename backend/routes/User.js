const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

// Only admins can access these routes
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({message: "Welcome admin"})
})

// Only vendors can access these routes
router.get("/vendor", verifyToken, authorizeRoles("vendor", "admin"), (req, res) => {
    res.json({message: "Welcome vendor"})
})

// Only users can access these routes
router.get("/user", verifyToken, authorizeRoles("user"), (req, res) => {
    res.json({message: "Welcome user"})
})

module.exports = router;