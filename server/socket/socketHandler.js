const { Message } = require('../models/Message');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }

    socket.on('joinRoom', (convoId) => socket.join(convoId));

    socket.on('sendMessage', async ({ convoId, senderId, text }) => {
      const msg = await Message.create({
        conversation: convoId,
        sender: senderId,
        text
      });
      const populated = await msg.populate('sender', 'name avatar');
      io.to(convoId).emit('receiveMessage', populated);
    });

    socket.on('typing', ({ convoId, userId }) => {
      socket.to(convoId).emit('userTyping', userId);
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};