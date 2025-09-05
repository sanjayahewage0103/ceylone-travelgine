const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage', required: true },
  date: { type: Date, required: true },
  peopleCount: { type: Number, required: true, min: 1 },
  paymentMethod: { type: String, enum: ['card', 'paypal', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
