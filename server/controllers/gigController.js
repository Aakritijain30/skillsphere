const Gig = require('../models/Gig');

exports.createGig = async (req, res) => {
  try {
    const gig = await Gig.create({ ...req.body, client: req.user._id });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllGigs = async (req, res) => {
  try {
    const { search, category, minBudget, maxBudget, city } = req.query;
    const query = { status: 'open' };
    if (search)    query.$text = { $search: search };
    if (category)  query.category = category;
    if (city)      query['location.city'] = new RegExp(city, 'i');
    if (minBudget) query.budgetMin = { $gte: Number(minBudget) };
    if (maxBudget) query.budgetMax = { $lte: Number(maxBudget) };

    const gigs = await Gig.find(query)
      .populate('client', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name avatar email');
    if (!gig) return res.status(404).json({ message: 'Gig nahi mili' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    if (gig.client.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this gig' });

    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};