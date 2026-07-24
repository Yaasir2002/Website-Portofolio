const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, toggleMessageRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
