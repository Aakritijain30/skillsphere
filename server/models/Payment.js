const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  client:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancer:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gig:       { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  orderId:   { type: String },
  paymentId: { type: String },
  amount:    { type: Number },
  status:    { type: String, enum: ['pending','completed','refunded'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);