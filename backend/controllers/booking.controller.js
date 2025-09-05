const BookingService = require('../services/booking.service');

class BookingController {
  static async createBooking(req, res) {
    try {
      const user = req.user?._id || req.body.user; // fallback for unauth
      const {
        tourPackage,
        date,
        peopleCount,
        paymentMethod,
        contactName,
        contactEmail,
        contactPhone
      } = req.body;
      const booking = await BookingService.createBooking({
        user,
        tourPackage,
        date,
        peopleCount,
        paymentMethod,
        contactName,
        contactEmail,
        contactPhone
      });
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getUserBookings(req, res) {
    try {
      const user = req.user?._id || req.query.user;
      const bookings = await BookingService.getUserBookings(user);
      res.json(bookings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = BookingController;
