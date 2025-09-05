const Booking = require('../models/booking.model');
const TourPackage = require('../models/tourPackage.model');
const User = require('../models/user.model');

class GuideBookingService {
  // Get all bookings for tours owned by this guide
  static async getBookingsForGuide(guideId, { status, search }) {
    // Find all tour packages owned by this guide
  const tourIds = (await TourPackage.find({ guide_id: guideId }, '_id')).map(t => t._id);
    // Build query
    const query = { tourPackage: { $in: tourIds } };
    if (status) query.status = status;
    // Optionally filter by tourist name/email
    let bookings = await Booking.find(query).populate('user').populate('tourPackage');
    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter(b =>
        b.user?.name?.toLowerCase().includes(s) ||
        b.user?.email?.toLowerCase().includes(s)
      );
    }
    return bookings;
  }

  static async updateBookingStatus(bookingId, status) {
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    return booking;
  }

  static async getBookingDetail(bookingId) {
    return Booking.findById(bookingId).populate('user').populate('tourPackage');
  }
}

module.exports = GuideBookingService;
