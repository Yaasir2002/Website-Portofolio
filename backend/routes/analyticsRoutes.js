const express = require('express');
const router = express.Router();
const { logVisitor, getDashboardAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/log', logVisitor);
router.get('/dashboard', protect, getDashboardAnalytics);

module.exports = router;
