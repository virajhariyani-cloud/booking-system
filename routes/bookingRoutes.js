const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');  // Changed from './middleware/auth' to '../middleware/auth'
const {
    bookSeats,
    getUserBookings,
    getBusSeats,
    cancelBooking
} = require('../controllers/bookingController');

router.post('/book', protect, bookSeats);
router.get('/my-bookings', protect, getUserBookings);
router.get('/bus-seats/:busId', getBusSeats);
router.delete('/cancel/:bookingId', protect, cancelBooking);

module.exports = router;