const User = require('../models/User');
const FreelancerProfile = require('../models/FreelancerProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    console.log('Register request:', req.body);
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ 
  name, 
  email, 
  password, 
  role: email === 'admin@skillsphere.com' ? 'admin' : role 
});
    
    console.log('User created:', user._id);

    if (role === 'freelancer') {
      await FreelancerProfile.create({ user: user._id });
    }

    const token = generateToken(user._id);
    console.log('Token generated');

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request:', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email not found' });
    if (user.isSuspended) return res.status(403).json({ message: 'Account suspended' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Wrong password' });

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.log('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};