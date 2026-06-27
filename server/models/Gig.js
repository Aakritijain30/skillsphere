const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  client:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String },
  skills:      [String],
  budgetMin:   { type: Number },
  budgetMax:   { type: Number },
  deadline:    { type: Date },
  status:      { type: String, enum: ['open','in-progress','completed','cancelled'], default: 'open' },
  milestones:  [{ title: String, amount: Number, dueDate: Date, status: { type: String, default: 'pending' } }],
  location:    { city: String, country: String },
}, { timestamps: true });

gigSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Gig', gigSchema);