const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_portfolio_2026_change_this_in_production', {
    expiresIn: '7d',
  });
};

// @desc Auth admin & get token
// @route POST /api/auth/login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        title: user.title,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get site profile data (public & admin)
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    let user = await User.findOne().select('-password');
    if (!user) {
      // Return default initial profile if database is fresh
      return res.json({
        name: 'Alex Rivera',
        title: 'Creative Designer & Full-Stack Developer',
        bio: 'Saya seorang desainer dan pengembang web apasionat yang berfokus menciptakan pengalaman digital modern, interaktif, dan berestetika tinggi.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        location: 'Jakarta, Indonesia',
        email: 'contact@alexrivera.dev',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          dribbble: 'https://dribbble.com',
          instagram: 'https://instagram.com',
          twitter: 'https://x.com',
        },
        stats: {
          yearsExperience: 5,
          completedProjects: 42,
          happyClients: 30,
        },
        experiences: [],
        education: [],
        skillCategories: [],
        toolsIcons: [],
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile (protected admin)
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name !== undefined ? req.body.name : user.name;
      user.title = req.body.title !== undefined ? req.body.title : user.title;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.email = req.body.email !== undefined ? req.body.email : user.email;

      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      if (req.body.logo !== undefined) {
        user.logo = req.body.logo;
      }

      if (req.body.socialLinks) {
        user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
      }

      if (req.body.stats) {
        user.stats = { ...user.stats, ...req.body.stats };
      }

      if (req.body.experiences !== undefined) {
        user.experiences = req.body.experiences;
      }

      if (req.body.education !== undefined) {
        user.education = req.body.education;
      }

      if (req.body.skillCategories !== undefined) {
        user.skillCategories = req.body.skillCategories;
      }

      if (req.body.toolsIcons !== undefined) {
        user.toolsIcons = req.body.toolsIcons;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getProfile,
  updateProfile,
};
