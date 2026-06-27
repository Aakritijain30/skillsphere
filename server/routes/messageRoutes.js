const router = require('express').Router();
const { getOrCreateConversation, getMessages, getMyConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getMyConversations);
router.get('/conversation/:userId', protect, getOrCreateConversation);
router.get('/:convoId', protect, getMessages);

module.exports = router;