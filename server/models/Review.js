const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gig:      { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);