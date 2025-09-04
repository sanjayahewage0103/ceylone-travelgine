const Vendor = require('../models/vendor.model');

exports.getOwnProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Public: Get vendor profile by vendorId (for user view)
exports.getVendorProfileById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select('-__v');
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOwnProfile = async (req, res) => {
  try {
    // Prepare update fields
    const updateFields = { ...req.body };

    // Handle uploaded files
    if (req.files) {
      if (req.files.profileBanner && req.files.profileBanner[0]) {
        updateFields.profileBanner = `/uploads/${req.files.profileBanner[0].filename}`;
      }
      if (req.files.logo && req.files.logo[0]) {
        updateFields['files.logoUrl'] = `/uploads/${req.files.logo[0].filename}`;
      }
    }

    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateFields },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
