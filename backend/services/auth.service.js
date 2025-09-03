const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Vendor = require('../models/vendor.model');
const Guide = require('../models/guide.model');
const { UserFactory, VendorUser, GuideUser } = require('../factories/user.factory');

const register = async (data) => {
  const { role, email, password, confirmPassword } = data;
  if (!role || !email || !password || !confirmPassword) {
    throw new Error('Missing required fields');
  }
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const userObject = UserFactory.create(role, { ...data, passwordHash });
  const userDoc = new User({
    fullName: userObject.fullName,
    email: userObject.email,
    contact: userObject.contact,
    nic: userObject.nic,
    passwordHash: userObject.passwordHash,
    role: userObject.role,
  });
  await userDoc.save();

  // Factory logic for vendor/guide profile creation
  if (userObject instanceof VendorUser) {
    const shop = data.shopDetails;
    await new Vendor({
      userId: userDoc._id,
      status: 'pending',
      shopName: shop.shopName,
      businessRegNum: shop.businessRegNum,
      location: shop.location,
      address: shop.address,
      description: shop.description,
      files: {
        logoUrl: shop.logoUrl,
        documentPdfUrl: shop.documentPdfUrl
      }
    }).save();
  }
  if (userObject instanceof GuideUser) {
    const guide = data.guideDetails;
    await new Guide({
      userId: userDoc._id,
      status: 'pending',
      sltdaRegNum: guide.sltdaRegNum,
      experienceYears: guide.experienceYears,
      languagesSpoken: guide.languagesSpoken,
      tourTypesOffered: guide.tourTypesOffered,
      bio: guide.bio,
      files: {
        profilePicUrl: guide.profilePicUrl,
        verificationPhotoUrl: guide.verificationPhotoUrl,
        sltdaLicensePicUrl: guide.sltdaLicensePicUrl,
        documentPdfUrl: guide.documentPdfUrl
      }
    }).save();
  }
  return { userId: userDoc._id, pending: role === 'vendor' || role === 'guide' };
};


const login = async (email, password) => {
  if (!email || !password) throw new Error('Missing credentials');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');
  let vendorStatus = undefined;
  if (user.role === 'vendor') {
    const vendorProfile = await Vendor.findOne({ userId: user._id });
    vendorStatus = vendorProfile ? vendorProfile.status : undefined;
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  return {
    token,
    user: {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      contact: user.contact,
      nic: user.nic,
      status: vendorStatus // only for vendor
    }
  };
};

module.exports = { register, login };
