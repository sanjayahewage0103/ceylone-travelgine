const express = require('express');
const router = express.Router();
const GuideBookingController = require('../controllers/guideBooking.controller');
const { authenticate } = require('../middleware/auth');

// All routes require guide authentication
router.use(authenticate);

// GET /api/guide/bookings?status=&search=
router.get('/bookings', GuideBookingController.getBookings);
// PATCH /api/guide/bookings/:id/status
router.patch('/bookings/:id/status', GuideBookingController.updateStatus);
// GET /api/guide/bookings/:id
router.get('/bookings/:id', GuideBookingController.getDetail);

module.exports = router;
