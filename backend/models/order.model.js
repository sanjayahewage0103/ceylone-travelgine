const mongoose = require('mongoose');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  shopName: String,
  category: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  deliveryMethod: { type: String, enum: ['Pickup', 'Courier'], required: true },
  deliveryAddress: { type: String },
  contactNumber: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Card', 'Mobile', 'Cash'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Rejected'], default: 'Pending' },
  paymentDetails: { type: String }, // encrypted JSON if card
}, { timestamps: true });

// Generate orderId before save
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = 'ORD-' + (1001 + count);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
