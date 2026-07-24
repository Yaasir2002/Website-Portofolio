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

// @desc Register a new admin account via API
// @route POST /api/auth/register
const registerAdmin = async (req, res) => {
  const { username, password, name, title, secretKey } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    const userCount = await User.countDocuments();
    const envSecretKey = process.env.ADMIN_SECRET_KEY || 'super_secret_admin_key_2026';

    // Security check: if an admin exists, require either a valid Bearer token OR valid secretKey
    if (userCount > 0) {
      let isAuthorized = false;

      // Check Bearer Token in headers
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'super_secret_jwt_key_portfolio_2026_change_this_in_production'
          );
          if (decoded && decoded.id) isAuthorized = true;
        } catch (e) {
          // Token invalid or expired
        }
      }

      // Check secretKey in request body
      if (secretKey && secretKey === envSecretKey) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        return res.status(403).json({
          message: 'Pendaftaran admin memerlukan token admin yang sedang login atau secretKey yang valid',
        });
      }
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username sudah terdaftar' });
    }

    const user = new User({
      username,
      password, // Hashed automatically by Mongoose pre('save') hook
      name: name || 'Alex Rivera',
      title: title || 'Creative Designer & Full-Stack Developer',
    });

    const createdUser = await user.save();

    res.status(201).json({
      _id: createdUser._id,
      username: createdUser.username,
      name: createdUser.name,
      title: createdUser.title,
      token: generateToken(createdUser._id),
      message: 'Akun Admin baru berhasil didaftarkan!',
    });
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
  registerAdmin,
  getProfile,
  updateProfile,
};
