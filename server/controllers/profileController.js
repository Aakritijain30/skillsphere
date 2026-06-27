const FreelancerProfile = require('../models/FreelancerProfile');

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email avatar');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};