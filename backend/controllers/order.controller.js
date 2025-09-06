const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
const Cart = require('../models/cart.model');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPT_KEY || '12345678901234567890123456789012'; // 32 chars
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deliveryMethod, deliveryAddress, contactNumber, paymentMethod, cardDetails } = req.body;
    // Get cart
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      populate: { path: 'vendorId', select: 'shopName' }
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    // Find the first product with a valid vendorId
    let vendorId = null;
    for (const item of cart.items) {
      if (item.productId.vendorId && item.productId.vendorId._id) {
        vendorId = item.productId.vendorId._id;
        break;
      }
    }
    if (!vendorId) {
      return res.status(400).json({ error: 'One or more products in your cart are missing vendor/shop info. Please remove them and try again.' });
    }
    // Prepare order items
    const items = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.images?.[0] || '',
      shopName: item.productId.vendorId?.shopName,
      category: item.productId.category,
      price: item.price,
      quantity: item.quantity,
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // Encrypt card details if needed
    let encryptedCard = '';
    if (paymentMethod === 'Card' && cardDetails) {
      encryptedCard = encrypt(JSON.stringify(cardDetails));
      // DEMO PAYMENT GATEWAY
      const axios = require('axios');
      try {
        const payRes = await axios.post(
          process.env.DEMO_PAYMENT_URL || 'http://localhost:5000/api/demo-payment/pay',
          { amount: totalAmount, cardDetails },
          { timeout: 5000 }
        );
        if (!payRes.data || payRes.data.status !== 'success') {
          return res.status(402).json({ error: 'Payment failed. Please try again.' });
        }
      } catch (err) {
        return res.status(402).json({ error: 'Payment failed. Please try again.' });
      }
    }
    // Create order
    const order = new Order({
      userId,
      vendorId,
      items,
      totalAmount,
      currency: 'LKR',
      deliveryMethod,
      deliveryAddress,
      contactNumber,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
      orderStatus: 'Pending',
      paymentDetails: encryptedCard,
    });
    await order.save();

    // Decrement product stockQuantity for each item
    const Product = require('../models/product.model');
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      );
    }

    // Create payment record
    await Payment.create({
      orderId: order.orderId,
      userId,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
      cardDetails: encryptedCard,
      amount: totalAmount,
    });
    // Clear cart
    cart.items = [];
    await cart.save();
    res.json({
      orderId: order.orderId,
      total: totalAmount,
      currency: 'LKR',
      deliveryMethod,
      deliveryAddress,
      contactNumber,
      paymentMethod,
      status: order.orderStatus,
      shopName: items[0].shopName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const Vendor = require('../models/vendor.model');
exports.getOrdersForVendor = async (req, res) => {
  try {
    // Find the Vendor document for this user
    const vendorDoc = await Vendor.findOne({ userId: req.user._id });
    if (!vendorDoc) return res.status(404).json({ error: 'Vendor profile not found' });
    const orders = await Order.find({ vendorId: vendorDoc._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email contact');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    let { status } = req.body;
    // Normalize status to match backend enum
    if (typeof status === 'string') {
      status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      // Map common lowercase values to backend enum
      if (status === 'Processing') status = 'Preparing';
      if (status === 'Cancelled') status = 'Rejected';
    }
    const allowed = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const order = await Order.findOneAndUpdate({ orderId }, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
