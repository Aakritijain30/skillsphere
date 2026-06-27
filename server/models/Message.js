const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage:  { type: String, default: '' },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text:         { type: String },
  readBy:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
const Message      = mongoose.model('Message', messageSchema);

module.exports = { Conversation, Message };