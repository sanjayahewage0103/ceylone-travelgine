const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const productController = require('../controllers/product.controller');
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

// Get products for the logged-in vendor
router.get('/me/products', authenticateVendor, productController.getVendorProducts);

// Public: Get all vendors (for dropdown selection)
router.get('/', async (req, res) => {
	try {
		const Vendor = require('../models/vendor.model');
		const vendors = await Vendor.find({}, 'shopName _id');
		res.json(vendors);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
