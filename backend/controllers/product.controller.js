// Get product by ID (public)
exports.getProductById = async (req, res) => {
  try {
    const Product = require('../models/product.model');
    const Vendor = require('../models/vendor.model');
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'vendorId',
        select: 'shopName logo location description',
      });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get unique categories from approved products
exports.getProductCategories = async (req, res) => {
  try {
    const Product = require('../models/product.model');
    const categories = await Product.distinct('category', { isApproved: 'approved', isActive: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get full vendor details for all approved vendors
exports.getProductShops = async (req, res) => {
  try {
    const Vendor = require('../models/vendor.model');
    // Get all approved vendors
    const shops = await Vendor.find({ status: 'approved' })
      .select('shopName location description files.logoUrl')
      .lean();
    res.json(shops.map(shop => ({
      id: shop._id,
      shopName: shop.shopName,
      location: shop.location,
      description: shop.description,
      logoUrl: shop.files && shop.files.logoUrl ? shop.files.logoUrl : undefined
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Public: Get latest 10 approved and active products for marketplace
exports.getFeaturedProducts = async (req, res) => {
  try {
    const Product = require('../models/product.model');
    const { search = '', category = '', minPrice, maxPrice, shop, vendorId } = req.query;
    let query = { isApproved: 'approved', isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (shop) {
      // Find vendorId(s) for the given shop name
      const Vendor = require('../models/vendor.model');
      const vendors = await Vendor.find({ shopName: shop }, '_id');
      const vendorIds = vendors.map(v => v._id);
      query.vendorId = { $in: vendorIds };
    }
    if (vendorId) {
      query.vendorId = vendorId;
    }
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(search || category || vendorId ? 100 : 10)
      .populate({
        path: 'vendorId',
        select: 'shopName businessRegNum location address userId',
        populate: { path: 'userId', select: 'fullName email contact' }
      });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const { description, price, stockQuantity, isActive } = req.body;
    // Handle images: combine existing and new, allow removal
    let images = [];
    if (req.body.existingImages) {
      // existingImages is a JSON stringified array
      images = JSON.parse(req.body.existingImages);
    }
    if (req.files && req.files.length > 0) {
      images = images.concat(req.files.map(f => `/uploads/${f.filename}`));
    }
    // At least one image must remain
    if (images.length < 1) return res.status(400).json({ error: 'At least one image is required.' });
    const product = await productService.updateProduct(req.params.id, vendorId, {
      description,
      price,
      stockQuantity,
      images,
      isActive
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const productService = require('../services/product.service');

// Controller: OOP, delegates to service, handles req/res
exports.createProduct = async (req, res) => {
  try {
    // Find the Vendor profile for this user
    const Vendor = require('../models/vendor.model');
    const vendorProfile = await Vendor.findOne({ userId: req.user._id });
    if (!vendorProfile) {
      return res.status(400).json({ error: 'Vendor profile not found for this user.' });
    }
    if (vendorProfile.status !== 'approved') {
      return res.status(403).json({ error: 'Vendor profile is pending approval' });
    }
    const vendorId = vendorProfile._id;
    const { originalItemId, name, description, price, category, stockQuantity } = req.body;
    // Images: multer files (array)
    const images = (req.files && req.files.length > 0) ? req.files.map(f => `/uploads/${f.filename}`) : [];
    if (images.length < 1) return res.status(400).json({ error: 'At least one image is required.' });
    const product = await productService.createProduct({
      vendorId,
      originalItemId,
      name,
      description,
      price,
      category,
      stockQuantity,
      images,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVendorProducts = async (req, res) => {
  try {
    const Vendor = require('../models/vendor.model');
    const vendorProfile = await Vendor.findOne({ userId: req.user._id });
    if (!vendorProfile) {
      console.error('Vendor profile not found for user:', req.user._id);
      return res.status(404).json({ error: 'Vendor profile not found.' });
    }
    if (vendorProfile.status !== 'approved') {
      return res.status(403).json({ error: 'Vendor profile is pending approval' });
    }
    console.log('getVendorProducts called for vendorId:', vendorProfile._id);
    const products = await productService.getVendorProducts(vendorProfile._id);
    console.log('Products found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Error in getVendorProducts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.setProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const product = await productService.setProductStatus(id, isActive);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
