const express = require('express');
const router = express.Router();
const CartService = require('../services/cart.service');
const { authenticate } = require('../middleware/auth');

// Get user cart
router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update item in cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity, selectedOptions } = req.body;
    const cart = await CartService.addItem(req.user._id, { productId, quantity, selectedOptions });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove item from cart
router.delete('/item/:productId', authenticate, async (req, res) => {
  try {
    const cart = await CartService.removeItem(req.user._id, req.params.productId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Checkout (clear cart)
router.post('/checkout', authenticate, async (req, res) => {
  try {
    await CartService.clearCart(req.user._id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
