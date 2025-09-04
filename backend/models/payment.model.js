const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, enum: ['Card', 'Mobile', 'Cash'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  cardDetails: { type: String }, // encrypted JSON if card
  amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
