const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateVendor } = require('../middleware/auth');
const upload = require('../config/upload');

// Add product (with 1-5 images)
router.post('/', authenticateVendor, upload.array('images'), productController.createProduct);

// List products for logged-in vendor
router.get('/vendor', authenticateVendor, productController.getVendorProducts);


// Edit product (description, price, stock, images, status)
router.patch('/:id', authenticateVendor, upload.array('images'), productController.updateProduct);

// Change product status (active/inactive)
router.patch('/:id/status', authenticateVendor, productController.setProductStatus);

module.exports = router;
