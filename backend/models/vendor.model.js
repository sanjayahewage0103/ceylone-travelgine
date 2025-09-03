const mongoose = require('mongoose');


const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  shopName: { type: String, required: true },
  businessRegNum: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  shopContact: { type: String }, // optional, editable after approval
  shopMail: { type: String }, // optional, editable after approval
  profileBanner: { type: String }, // optional, editable after approval
  files: {
    logoUrl: { type: String },
    documentPdfUrl: { type: String }
  },
  // Add more fields as needed for future extensibility
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
