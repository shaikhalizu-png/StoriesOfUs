const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get all friends
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users to add as friends
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      _id: { $ne: req.user._id },
      name: { $regex: q, $options: 'i' }
    }).select('name email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a friend
router.post('/add/:userId', auth, async (req, res) => {
  try {
    const friendId = req.params.userId;
    
    if (friendId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't add yourself as a friend" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add friend to current user
    if (!req.user.friends.includes(friendId)) {
      req.user.friends.push(friendId);
      await req.user.save();
    }

    // Add current user to friend's list (mutual friendship)
    if (!friend.friends.includes(req.user._id)) {
      friend.friends.push(req.user._id);
      await friend.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('friends', 'name email');
    res.json(updatedUser.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a friend
router.delete('/remove/:userId', auth, async (req, res) => {
  try {
    const friendId = req.params.userId;

    // Remove from current user
    req.user.friends = req.user.friends.filter(f => f.toString() !== friendId);
    await req.user.save();

    // Remove from friend's list
    const friend = await User.findById(friendId);
    if (friend) {
      friend.friends = friend.friends.filter(f => f.toString() !== req.user._id.toString());
      await friend.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('friends', 'name email');
    res.json(updatedUser.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

