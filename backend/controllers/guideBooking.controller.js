const GuideBookingService = require('../services/guideBooking.service');

class GuideBookingController {
  static async getBookings(req, res) {
    try {
      const guideId = req.user._id;
      const { status, search } = req.query;
      const bookings = await GuideBookingService.getBookingsForGuide(guideId, { status, search });
      res.json(bookings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const booking = await GuideBookingService.updateBookingStatus(id, status);
      res.json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      const booking = await GuideBookingService.getBookingDetail(id);
      res.json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = GuideBookingController;
