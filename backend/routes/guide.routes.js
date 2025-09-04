const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');
const { authenticate } = require('../middleware/auth');

// GET /api/guides/me - Get current guide profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserService.getUserDetails(userId);
    if (!user || user.role !== 'guide') {
      return res.status(404).json({ error: 'Guide profile not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
