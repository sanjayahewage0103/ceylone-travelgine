const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth');

// Create a booking (user must be authenticated)
router.post('/', authenticate, BookingController.createBooking);

// Get bookings for current user
router.get('/my', authenticate, BookingController.getUserBookings);

module.exports = router;
