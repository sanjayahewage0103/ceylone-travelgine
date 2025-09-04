const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// GET /api/vendors/:vendorId/products - Get products for a vendor
router.get('/:vendorId/products', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const vendorId = req.params.vendorId;
    // Validate and convert vendorId to ObjectId if possible
    let objectId;
    if (mongoose.Types.ObjectId.isValid(vendorId)) {
      objectId = mongoose.Types.ObjectId(vendorId);
    } else {
      return res.status(400).json({ error: 'Invalid vendorId format' });
    }
    const products = await Product.find({ vendorId: objectId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
