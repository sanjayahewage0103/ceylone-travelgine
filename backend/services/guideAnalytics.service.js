const Booking = require('../models/booking.model');
const TourPackage = require('../models/tourPackage.model');
const mongoose = require('mongoose');

class GuideAnalyticsService {
  // OOP: Single Responsibility - this class only handles analytics for guides
  static async getGuideAnalytics(guideId) {
    // Defensive: Validate guideId
    if (!mongoose.Types.ObjectId.isValid(guideId)) throw new Error('Invalid guide id');
    // Find all tour packages for this guide
    const tourIds = (await TourPackage.find({ guide_id: guideId }, '_id')).map(t => t._id);
    // Completed trips: bookings with status 'paid' and date in the past
    const now = new Date();
    const completedTrips = await Booking.countDocuments({ tourPackage: { $in: tourIds }, status: 'paid', date: { $lt: now } });
    // Total revenue: sum of totalPrice for completed trips
    const revenueAgg = await Booking.aggregate([
      { $match: { tourPackage: { $in: tourIds }, status: 'paid', date: { $lt: now } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    // Upcoming bookings: count and next booking
    const upcomingBookings = await Booking.find({ tourPackage: { $in: tourIds }, status: { $in: ['pending', 'paid'] }, date: { $gte: now } }).sort('date');
    const upcomingCount = upcomingBookings.length;
    const nextBooking = upcomingBookings[0] || null;
    // Last 6 months revenue (for chart)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { tourPackage: { $in: tourIds }, status: 'paid', date: { $gte: sixMonthsAgo, $lt: now } } },
      { $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$totalPrice' }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    // Pending booking requests
    const pendingBookings = await Booking.find({ tourPackage: { $in: tourIds }, status: 'pending' }).sort('date');
    // Event calendar: all bookings for this guide
    const allBookings = await Booking.find({ tourPackage: { $in: tourIds } }).sort('date');
    // Return analytics object
    return {
      completedTrips,
      totalRevenue,
      upcomingCount,
      nextBooking,
      monthlyRevenue,
      pendingBookings,
      eventCalendar: allBookings
    };
  }
}

module.exports = GuideAnalyticsService;
