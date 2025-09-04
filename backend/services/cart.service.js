const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartService {
  // Get cart for user
  static async getCart(userId) {
    // Populate product and its vendorId for shop name
    return await Cart.findOne({ userId })
      .populate({
        path: 'items.productId',
        populate: { path: 'vendorId', select: 'shopName name' }
      });
  }

  // Add or update item in cart
  static async addItem(userId, { productId, quantity, selectedOptions }) {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId &&
        (!selectedOptions || JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        selectedOptions,
        price: product.price,
      });
    }
    await cart.save();
    return cart;
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    return cart;
  }

  // Clear cart (on checkout)
  static async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return cart;
  }
}

module.exports = CartService;
