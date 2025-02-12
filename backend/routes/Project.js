const express = require('express');
const projectController = require('../controllers/Project');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require("../middleware/roleMiddleware")
const router = express.Router();

router.post('/', verifyToken, authorizeRoles("admin"), projectController.createProject);
router.get('/', verifyToken, authorizeRoles("admin", "vendor", "user"), projectController.getProjects);
router.put('/:projectId', verifyToken, authorizeRoles("admin"), projectController.updateProject);

module.exports = router;
