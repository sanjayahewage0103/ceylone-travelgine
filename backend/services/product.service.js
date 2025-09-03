// ProductService: OOP, SRP, handles all product business logic
const Product = require('../models/product.model');


class ProductService {
  async createProduct({ vendorId, originalItemId, name, description, price, category, stockQuantity, images }) {
    // Uniqueness check
    if (await Product.isDuplicate(vendorId, name, originalItemId)) {
      throw new Error('Duplicate product name or original item ID for this vendor.');
    }
    const product = new Product({
      vendorId,
      originalItemId,
      name,
      description,
      price,
      category,
      stockQuantity,
      images,
      isActive: true,
      isApproved: 'pending',
    });
    return await product.save();
  }

  async updateProduct(productId, vendorId, { description, price, stockQuantity, images, isActive }) {
    const product = await Product.findOne({ _id: productId, vendorId });
    if (!product) throw new Error('Product not found or not owned by vendor.');
    // At least one image must remain
    if (images && images.length < 1) throw new Error('At least one image is required.');
    // Only allow editing allowed fields
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (isActive !== undefined) product.isActive = isActive;
    if (images) product.images = images;
    // name/originalItemId cannot be changed
    await product.save();
    return product;
  }

  async getVendorProducts(vendorId) {
    return Product.find({ vendorId }).sort({ createdAt: -1 });
  }

  async setProductStatus(productId, isActive) {
    return Product.findByIdAndUpdate(productId, { isActive }, { new: true });
  }

  async getProductById(productId) {
    return Product.findById(productId);
  }
}

module.exports = new ProductService();
