const mongoose = require('mongoose');


const sectionSchema = new mongoose.Schema({
  subtitle: { type: String },
  content: { type: String, required: true },
  image: { type: String },
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  mainImage: { type: String },
  sections: [sectionSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
