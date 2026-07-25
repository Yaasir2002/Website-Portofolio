const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  getMe,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/profile', getProfile);
router.put('/profile', protect, updateProfile);

router.post('/upload-avatar', protect, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path && (req.file.path.startsWith('http') || req.file.path.startsWith('https'))
    ? req.file.path
    : req.file.secure_url
    ? req.file.secure_url
    : `/uploads/${req.file.filename}`;

  res.json({ filePath });
});

module.exports = router;
