const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// Get messages with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name')
    .populate('receiver', 'name');

    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/:userId', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const message = new Message({
      sender: req.user._id,
      receiver: req.params.userId,
      content
    });

    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('receiver', 'name');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get unread message counts
router.get('/unread/count', auth, async (req, res) => {
  try {
    const counts = await Message.aggregate([
      { $match: { receiver: req.user._id, read: false } },
      { $group: { _id: '$sender', count: { $sum: 1 } } }
    ]);

    const unreadCounts = {};
    counts.forEach(c => {
      unreadCounts[c._id.toString()] = c.count;
    });

    res.json(unreadCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

