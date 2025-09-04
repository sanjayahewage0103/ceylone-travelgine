const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

function imageFileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
  }
}

const upload = multer({ storage, fileFilter: imageFileFilter });

// GET /api/guides/me - Get current guide profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await UserService.getUserDetails(req.user.id);
    if (!user || user.role !== 'guide') {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/guides/me - Update current guide profile
router.put('/me', authenticate, upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await UserService.getUserDetails(req.user.id, { lean: false });
    if (!user || user.role !== 'guide') {
      return res.status(404).json({ error: 'Guide not found' });
    }
    // Update fields
    user.fullName = req.body.fullName || user.fullName;
    user.contact = req.body.contact || user.contact;
    user.email = req.body.email || user.email;
    if (user.guideProfile) {
      user.guideProfile.bio = req.body.bio || user.guideProfile.bio;
      user.guideProfile.languagesSpoken = req.body.languagesSpoken ? req.body.languagesSpoken.split(',').map(l => l.trim()) : user.guideProfile.languagesSpoken;
      if (!user.guideProfile.files) user.guideProfile.files = {};
      if (req.files && req.files.profilePic && req.files.profilePic[0]) {
        user.guideProfile.files.profilePicUrl = `/uploads/${req.files.profilePic[0].filename}`;
        console.log('DEBUG: Saved profilePic:', user.guideProfile.files.profilePicUrl);
      }
      if (req.files && req.files.banner && req.files.banner[0]) {
        user.guideProfile.files.profileBanner = `/uploads/${req.files.banner[0].filename}`;
        console.log('DEBUG: Saved banner:', user.guideProfile.files.profileBanner);
      }
      await user.guideProfile.save();
    }
    await user.save();
    // Re-fetch user with updated guideProfile and return
    const updatedUser = await UserService.getUserDetails(req.user.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
