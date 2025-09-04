const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { authenticateVendor } = require('../middleware/auth');
const upload = require('../config/upload');

// Get own vendor profile
router.get('/me', authenticateVendor, vendorController.getOwnProfile);
// Update own vendor profile (with banner/logo upload)
router.put('/me', authenticateVendor, upload.fields([
	{ name: 'profileBanner', maxCount: 1 },
	{ name: 'logo', maxCount: 1 }
]), vendorController.updateOwnProfile);
// Public: Get vendor profile by vendorId (for user view)
router.get('/:vendorId', vendorController.getVendorProfileById);

module.exports = router;
