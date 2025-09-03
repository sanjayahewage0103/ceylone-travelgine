const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { _id: false });


const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  originalItemId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Handicrafts', 'Gems & Jewellery', 'Food & Spices', 'Wellness & Ayurveda', 'Other'],
    required: true
  },
  stockQuantity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  images: [{ type: String }],
  reviews: [reviewSchema],
}, { timestamps: true });

// Unique index for name and originalItemId per vendor
productSchema.index({ vendorId: 1, name: 1 }, { unique: true });
productSchema.index({ vendorId: 1, originalItemId: 1 }, { unique: true });

// Static method to check for duplicate name/originalItemId
productSchema.statics.isDuplicate = async function (vendorId, name, originalItemId, excludeId = null) {
  const query = {
    vendorId,
    $or: [
      { name },
      { originalItemId }
    ]
  };
  if (excludeId) query._id = { $ne: excludeId };
  const found = await this.findOne(query);
  return !!found;
};

module.exports = mongoose.model('Product', productSchema);
