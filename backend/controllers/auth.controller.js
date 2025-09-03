const authService = require('../services/auth.service');


const register = async (req, res) => {
  try {
    // For FormData, fields are in req.body, files in req.files
    const data = { ...req.body };

    // Attach file paths if files are present
    if (req.files) {
      if (req.files.logo) {
        data.logoUrl = req.files.logo[0].path;
      }
      if (req.files.documentPdf) {
        data.documentPdfUrl = req.files.documentPdf[0].path;
      }
    }

    // Group vendor fields into shopDetails if role is vendor
    if (data.role === 'vendor') {
      data.shopDetails = {
        shopName: data.shopName,
        businessRegNum: data.businessRegNum,
        location: data.location,
        address: data.address,
        description: data.description,
        logoUrl: data.logoUrl,
        documentPdfUrl: data.documentPdfUrl
      };
      // Debug log for vendor registration
      console.log('Vendor registration received data:', data);
      console.log('Grouped shopDetails:', data.shopDetails);
    }

    // Now pass data to your service
    const result = await authService.register(data);
    res.status(201).json({ message: 'Registration successful', ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
