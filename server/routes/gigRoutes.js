const router = require('express').Router();
const { createGig, getAllGigs, getGigById, deleteGig } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllGigs);
router.get('/:id', getGigById);
router.post('/', protect, createGig);
router.delete('/:id', protect, deleteGig);

module.exports = router;