const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio:          { type: String, default: '' },
  skills:       [{ name: String, proficiency: { type: String, enum: ['beginner','intermediate','expert'] } }],
  portfolio:    [{ title: String, description: String, imageUrl: String, link: String }],
  hourlyRate:   { type: Number, default: 0 },
  availability: { type: String, enum: ['available','busy','unavailable'], default: 'available' },
  isVerified:   { type: Boolean, default: false },
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  totalEarnings:{ type: Number, default: 0 },
  location:     { city: String, country: String },
}, { timestamps: true });

module.exports = mongoose.model('FreelancerProfile', freelancerProfileSchema);