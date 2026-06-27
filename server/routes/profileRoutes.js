const router = require('express').Router();
const { getMyProfile, updateProfile, getProfileByUserId } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateProfile);
router.get('/:userId', getProfileByUserId);

module.exports = router;