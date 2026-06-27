const Review = require('../models/Review');
const FreelancerProfile = require('../models/FreelancerProfile');

exports.addReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, reviewer: req.user._id });

    const reviews = await Review.find({ reviewee: req.body.reviewee });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await FreelancerProfile.findOneAndUpdate(
      { user: req.body.reviewee },
      { rating: avg.toFixed(1), reviewCount: reviews.length }
    );

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};