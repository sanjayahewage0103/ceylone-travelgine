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
    const vendorId = req.user._id;
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
    const vendorId = req.user._id;
    const products = await productService.getVendorProducts(vendorId);
    res.json(products);
  } catch (err) {
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
