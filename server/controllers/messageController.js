const { Conversation, Message } = require('../models/Message');

exports.getOrCreateConversation = async (req, res) => {
  try {
    let convo = await Conversation.findOne({
      participants: { $all: [req.user._id, req.params.userId] }
    });
    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user._id, req.params.userId]
      });
    }
    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.convoId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar');
    res.json(convos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};