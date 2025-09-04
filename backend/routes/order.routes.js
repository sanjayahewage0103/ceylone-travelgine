const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth');
const { authenticateVendor } = require('../middleware/auth');

// Tourist places order (checkout)
router.post('/checkout', authenticate, orderController.checkout);

// Vendor: get all orders for their shop
router.get('/vendor', authenticateVendor, orderController.getOrdersForVendor);
// Vendor: update order status
router.put('/vendor/:orderId/status', authenticateVendor, orderController.updateOrderStatus);
router.patch('/vendor/:orderId/status', authenticateVendor, orderController.updateOrderStatus);

// Tourist: get all their orders
router.get('/user', authenticate, orderController.getOrdersForUser);

module.exports = router;
