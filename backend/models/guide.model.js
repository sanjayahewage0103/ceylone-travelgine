const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  sltdaRegNum: { type: String, required: true, unique: true },
  experienceYears: { type: Number, required: true },
  languagesSpoken: [{ type: String, required: true }],
  tourTypesOffered: [{ type: String, required: true }],
  bio: { type: String },
  files: {
    profilePicUrl: { type: String },
    verificationPhotoUrl: { type: String },
    sltdaLicensePicUrl: { type: String },
    documentPdfUrl: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
