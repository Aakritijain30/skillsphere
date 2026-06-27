const router = require('express').Router();
const { getStats, getAllUsers, suspendUser, verifyFreelancer } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/suspend/:id', suspendUser);
router.put('/verify/:id', verifyFreelancer);

module.exports = router;