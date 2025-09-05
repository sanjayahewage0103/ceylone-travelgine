const Booking = require('../models/booking.model');
const TourPackage = require('../models/tourPackage.model');

class BookingService {
  static async createBooking({ user, tourPackage, date, peopleCount, paymentMethod, contactName, contactEmail, contactPhone }) {
    // Validate tour package
    const pkg = await TourPackage.findById(tourPackage);
    if (!pkg) throw new Error('Tour package not found');
    // Calculate total price
    const totalPrice = pkg.price_lkr * peopleCount;
    // Create booking
    const booking = await Booking.create({
      user,
      tourPackage,
      date,
      peopleCount,
      paymentMethod,
      totalPrice,
      contactName,
      contactEmail,
      contactPhone,
      status: paymentMethod === 'cash' ? 'pending' : 'paid',
    });
    return booking;
  }

  static async getUserBookings(user) {
    return Booking.find({ user }).populate('tourPackage');
  }
}

module.exports = BookingService;
