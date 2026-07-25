const express = require('express');
const router = express.Router();
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  reorderPortfolios,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);

router.post('/', protect, createPortfolio);
router.put('/reorder', protect, reorderPortfolios);
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

router.post('/upload', protect, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path && (req.file.path.startsWith('http') || req.file.path.startsWith('https'))
    ? req.file.path
    : req.file.secure_url
    ? req.file.secure_url
    : `/uploads/${req.file.filename}`;

  const isVideo = req.file.mimetype ? req.file.mimetype.startsWith('video') : false;
  res.json({
    filePath,
    mediaType: isVideo ? 'video' : 'image',
  });
});

module.exports = router;
