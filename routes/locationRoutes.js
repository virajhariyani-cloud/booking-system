const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');  // Changed from './middleware/auth' to '../middleware/auth'
const {
    updateBusLocation,
    getBusLocation
} = require('../controllers/locationController');

router.put('/update', protect, isAdmin, updateBusLocation);
router.get('/:busId', getBusLocation);

module.exports = router;