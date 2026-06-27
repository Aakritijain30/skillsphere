const User = require('../models/User');
const Gig = require('../models/Gig');
const Payment = require('../models/Payment');
const FreelancerProfile = require('../models/FreelancerProfile');

exports.getStats = async (req, res) => {
  try {
    const [users, gigs, payments] = await Promise.all([
      User.countDocuments(),
      Gig.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);
    res.json({ users, gigs, revenue: payments[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyFreelancer = async (req, res) => {
  try {
    await FreelancerProfile.findOneAndUpdate(
      { user: req.params.id },
      { isVerified: true }
    );
    res.json({ message: 'Verified!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};