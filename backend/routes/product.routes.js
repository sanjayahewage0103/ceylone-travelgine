
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateVendor } = require('../middleware/auth');
const upload = require('../config/upload');
// Public: Get latest 10 approved and active products for marketplace
router.get('/', productController.getFeaturedProducts);
// Get unique categories from products
router.get('/categories', productController.getProductCategories);
// Get unique shop names from products
router.get('/shops', productController.getProductShops);

// Add product (with 1-5 images)
router.post('/', authenticateVendor, upload.array('images'), productController.createProduct);

// List products for logged-in vendor
router.get('/vendor', authenticateVendor, productController.getVendorProducts);


// Get product by ID (public)
router.get('/:id', productController.getProductById);
// Edit product (description, price, stock, images, status)
router.patch('/:id', authenticateVendor, upload.array('images'), productController.updateProduct);

// Change product status (active/inactive)
router.patch('/:id/status', authenticateVendor, productController.setProductStatus);

module.exports = router;
