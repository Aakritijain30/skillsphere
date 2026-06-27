const Proposal = require('../models/Proposal');

exports.submitProposal = async (req, res) => {
  try {
    const exists = await Proposal.findOne({
      gig: req.params.gigId,
      freelancer: req.user._id
    });
    if (exists) return res.status(400).json({ message: 'Pehle se proposal bheja hai' });

    const proposal = await Proposal.create({
      gig: req.params.gigId,
      freelancer: req.user._id,
      ...req.body
    });
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ gig: req.params.gigId })
      .populate('freelancer', 'name avatar email');
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};