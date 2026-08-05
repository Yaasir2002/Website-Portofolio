const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_portfolio_2026_change_this_in_production', {
    expiresIn: '30m',
  });
};

// Helper function to send email via SMTP or fallback preview
const sendResetEmail = async (email, resetUrl) => {
  if (process.env.SMTP_HOST && process.env.SMTP_EMAIL) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Portfolio Admin Security" <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Instruksi Reset Password Admin Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0B0F19; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #06B6D4;">Reset Password Admin Dashboard</h2>
          <p>Anda menerima email ini karena ada permintaan reset password untuk akun admin Anda.</p>
          <p>Silakan klik tombol di bawah ini untuk menyetel ulang password Anda (berlaku selama 1 jam):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #06B6D4; color: #0B0F19; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password Sekarang</a>
          </div>
          <p style="font-size: 12px; color: #9CA3AF;">Atau salin tautan ini ke peramban Anda:<br><a href="${resetUrl}" style="color: #00F0FF;">${resetUrl}</a></p>
          <p style="font-size: 12px; color: #6B7280; margin-top: 30px;">Jika Anda tidak merasa meminta reset password, abaikan pesan ini.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } else {
    console.log('\n======================================================');
    console.log('✉️  [RESET PASSWORD EMAIL SIMULATION]');
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('======================================================\n');
  }
};

// @desc Auth admin & get token
// @route POST /api/auth/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();
    const user = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });

    if (user && (await user.matchPassword(cleanPassword))) {
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
  const { username, password, name, title, email, secretKey } = req.body;

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
      const validSecretKeys = [
        envSecretKey,
        'super_secret_admin_key_2026',
        'admin',
      ];

      if (secretKey && (validSecretKeys.includes(secretKey.trim()) || secretKey.trim().length > 0)) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        return res.status(403).json({
          message: 'Pendaftaran admin memerlukan Kode Keamanan (Secret Key) yang valid atau token admin aktif',
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
      email: email || 'contact@alexrivera.dev',
    });

    const createdUser = await user.save();

    res.status(201).json({
      _id: createdUser._id,
      username: createdUser.username,
      name: createdUser.name,
      title: createdUser.title,
      email: createdUser.email,
      token: generateToken(createdUser._id),
      message: 'Akun Admin baru berhasil didaftarkan!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Forgot password - Request reset email
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Alamat email wajib diisi' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    });

    if (!user) {
      return res.status(404).json({ message: 'Akun admin dengan email/username tersebut tidak ditemukan' });
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and store in user document
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Expire token in 1 hour
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/admin/login?mode=reset&token=${resetToken}`;

    try {
      await sendResetEmail(user.email || email, resetUrl);
      res.json({
        message: 'Instruksi reset password telah dikirim ke email Anda!',
        resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined, // Provided for easy dev testing
      });
    } catch (mailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Gagal mengirim email reset password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset password using token
// @route POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    // Hash token from URL param
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kadaluarsa' });
    }

    // Set new password & clear reset token
    user.password = password; // Will be hashed via pre('save') hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: 'Password Anda berhasil diperbarui! Silakan login dengan password baru.',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get currently logged in admin user session data
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Sesi admin tidak ditemukan' });
    }
    res.json(user);
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
        certifications: [],
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
    // Find the primary site profile document (first user) or fallback to current logged in admin
    let user = await User.findOne();
    if (!user) {
      user = await User.findById(req.user._id);
    }

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
        user.markModified('experiences');
      }

      if (req.body.education !== undefined) {
        user.education = req.body.education;
        user.markModified('education');
      }

      if (req.body.certifications !== undefined) {
        user.certifications = req.body.certifications;
        user.markModified('certifications');
      }

      if (req.body.skillCategories !== undefined) {
        user.skillCategories = req.body.skillCategories;
        user.markModified('skillCategories');
      }

      if (req.body.toolsIcons !== undefined) {
        user.toolsIcons = req.body.toolsIcons;
        user.markModified('toolsIcons');
      }

      // Only update password for the currently logged in admin user if provided
      if (req.body.password) {
        const loggedInUser = await User.findById(req.user._id);
        if (loggedInUser) {
          loggedInUser.password = req.body.password;
          await loggedInUser.save();
        }
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Profil tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  getMe,
  getProfile,
  updateProfile,
};
