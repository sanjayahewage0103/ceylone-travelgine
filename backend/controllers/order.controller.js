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

exports.getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ vendorId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
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
