// Get a guide's public profile, blogs, and tour packages
// GET /api/guides/:id
exports.getGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id;
    // Fetch guide public info
    const guide = await require('../services/user.service').getUserDetails(guideId);
    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({ error: 'Guide not found' });
    }
    // Fetch blogs and tour packages by this guide
  const BlogPost = require('../models/blogPost.model');
  const TourPackage = require('../models/tourPackage.model');
  // BlogPost: author is userId
  // Only published blogs
  const blogs = await BlogPost.find({ author: guideId, status: 'published' }).select('title mainImage createdAt');
  // Only published tour packages
  const tours = await TourPackage.find({ guide_id: guideId, status: 'published' }).select('package_name images price_lkr');
    // Build response
    // Helper to prefix /uploads/ if not already present and value is not empty
    const prefixUpload = (val) => {
      if (!val) return '';
      if (val.startsWith('/uploads/')) return val;
      return '/uploads/' + val;
    };

    // Fix blog images
    const blogsFixed = blogs.map(blog => ({
      ...blog.toObject(),
      mainImage: blog.mainImage ? prefixUpload(blog.mainImage) : ''
    }));

    // Fix tour images
    const toursFixed = tours.map(tour => ({
      ...tour.toObject(),
      images: Array.isArray(tour.images) ? tour.images.map(img => prefixUpload(img)) : []
    }));

    res.json({
      id: guide._id,
      name: guide.fullName,
      profilePicture: prefixUpload(guide.guideProfile?.files?.profilePicUrl),
      bannerImage: prefixUpload(guide.guideProfile?.files?.profileBanner),
      bio: guide.guideProfile?.bio || '',
      contact: guide.contact,
      sltdaRegNum: guide.guideProfile?.sltdaRegNum || '',
      languagesSpoken: guide.guideProfile?.languagesSpoken || [],
      experienceYears: guide.guideProfile?.experienceYears || '',
      location: guide.guideProfile?.location || '',
      blogs: blogsFixed,
      tourPackages: toursFixed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
