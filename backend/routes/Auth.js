const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth');
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

router.post('/register', verifyToken, authorizeRoles("admin"), authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', verifyToken, authController.logoutUser);
router.get('/me', verifyToken, authController.returnUserDetails);

module.exports = router;