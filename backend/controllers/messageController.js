const Message = require('../models/Message');

// @desc Submit message from public contact form
// @route POST /api/messages
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newMessage = new Message({
      name,
      email,
      subject: subject || 'General Contact',
      message,
    });

    const saved = await newMessage.save();
    res.status(201).json({ message: 'Pesan Anda berhasil terkirim!', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all messages (admin)
// @route GET /api/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark message as read/unread (admin)
// @route PUT /api/messages/:id/read
const toggleMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = !message.isRead;
    const updated = await message.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete message (admin)
// @route DELETE /api/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.deleteOne({ _id: req.params.id });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
};
