const authService = require('../services/auth.service');


const register = async (req, res) => {
  try {
    // For FormData, fields are in req.body, files in req.files
    const data = { ...req.body };

    // Attach file paths for guide registration
    if (req.files) {
      if (req.files.profilePic) {
        data.profilePicUrl = req.files.profilePic[0].path;
      }
      if (req.files.verificationPhoto) {
        data.verificationPhotoUrl = req.files.verificationPhoto[0].path;
      }
      if (req.files.sltdaLicensePic) {
        data.sltdaLicensePicUrl = req.files.sltdaLicensePic[0].path;
      }
      if (req.files.documentPdf) {
        data.documentPdfUrl = req.files.documentPdf[0].path;
      }
      // Vendor files
      if (req.files.logo) {
        data.logoUrl = req.files.logo[0].path;
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

    // Group guide fields into guideDetails if role is guide
    if (data.role === 'guide') {
      data.guideDetails = {
        sltdaRegNum: data.sltdaRegNum,
        experienceYears: data.experienceYears,
        languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken : (data.languagesSpoken ? data.languagesSpoken.split(',').map(s => s.trim()) : []),
        tourTypesOffered: Array.isArray(data.tourTypesOffered) ? data.tourTypesOffered : (data.tourTypesOffered ? data.tourTypesOffered.split(',').map(s => s.trim()) : []),
        bio: data.bio,
        profilePicUrl: data.profilePicUrl,
        verificationPhotoUrl: data.verificationPhotoUrl,
        sltdaLicensePicUrl: data.sltdaLicensePicUrl,
        documentPdfUrl: data.documentPdfUrl
      };
      // Debug log for guide registration
      console.log('Guide registration received data:', data);
      console.log('Grouped guideDetails:', data.guideDetails);
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
