const express = require('express');
const router = express.Router();
const storeController = require('../controllers/Store');
const verifyToken = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

router.get('/', verifyToken, storeController.getStores);
router.post('/', verifyToken, storeController.addNewStore);
router.get('/:storeId', verifyToken, storeController.deleteStore);

module.exports = router;