const router = require('express').Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/user/:userId', getReviews);

module.exports = router;