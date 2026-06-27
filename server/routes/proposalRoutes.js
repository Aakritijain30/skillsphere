const router = require('express').Router();
const { submitProposal, getGigProposals, updateProposalStatus } = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/gig/:gigId', protect, submitProposal);
router.get('/gig/:gigId', protect, getGigProposals);
router.put('/:id', protect, updateProposalStatus);

module.exports = router;