const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.get('/profile', getProfile);
router.put('/profile', protect, updateProfile);

router.post('/upload-avatar', protect, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath });
});

module.exports = router;
