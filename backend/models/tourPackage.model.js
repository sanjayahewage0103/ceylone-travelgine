const mongoose = require('mongoose');


const itineraryStopSchema = new mongoose.Schema({
  stop: { type: String, required: true },
  time: { type: String }
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  stops: { type: [itineraryStopSchema], required: true, default: [] }
}, { _id: false });

const tourPackageSchema = new mongoose.Schema({
  package_name: { type: String, required: true },
  guide_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: true },
  duration: { type: String, enum: ['half-day', 'full-day', 'multi-day'], required: true },
  max_group_size: { type: Number, required: true },
  price_lkr: { type: Number, required: true },
  itinerary: [itineraryDaySchema],
  inclusions: [{ type: String }],
  exclusions: { type: String },
  availability: [{ type: String }], // ISO date strings
  languages: [{ type: String }],
  images: [{ type: String }], // URLs
  status: { type: String, enum: ['draft', 'published', 'booked_out'], default: 'published' },
  tourType: { type: String },
  tourCategory: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('TourPackage', tourPackageSchema);
