const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const TourPackageService = require('../services/tourPackage.service');
const multer = require('multer');
const path = require('path');

// Simple local image upload (can be replaced with cloud storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// Create tour package
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const data = req.body;
    data.guide_id = req.user.id;
    if (req.files) {
      data.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    if (data.itinerary && typeof data.itinerary === 'string') {
      data.itinerary = JSON.parse(data.itinerary);
    }
    if (data.inclusions && typeof data.inclusions === 'string') {
      data.inclusions = JSON.parse(data.inclusions);
    }
    if (data.languages && typeof data.languages === 'string') {
      data.languages = JSON.parse(data.languages);
    }
    if (data.availability && typeof data.availability === 'string') {
      data.availability = JSON.parse(data.availability);
    }
    const pkg = await TourPackageService.createTourPackage(data);
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Public: List all published tour packages with filters/search/sort
router.get('/public/all', async (req, res) => {
  try {
    const {
      search = '',
      tourType = '',
      tourCategory = '',
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;
    const filters = { search, tourType, tourCategory, minPrice, maxPrice, sortBy, sortOrder };
    const pkgs = await TourPackageService.getAllPublicTourPackages(filters);
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tour package by ID
router.get('/:id', async (req, res) => {
  try {
    const pkg = await TourPackageService.getTourPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List packages for a guide
router.get('/', async (req, res) => {
  try {
    const { guide_id } = req.query;
    if (!guide_id) return res.status(400).json({ error: 'guide_id required' });
    const pkgs = await TourPackageService.getTourPackagesByGuide(guide_id);
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tour package
router.put('/:id', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const data = req.body;
    // Get existing package to merge images
    const existing = await TourPackageService.getTourPackageById(req.params.id);
    let existingImages = (existing && existing.images) ? existing.images : [];
    if (req.files && req.files.length > 0) {
      // If new images uploaded, merge with existing
      data.images = [...existingImages, ...req.files.map(f => `/uploads/${f.filename}`)];
    } else if (data.images) {
      // If images sent as JSON string, parse and use
      if (typeof data.images === 'string') {
        try { data.images = JSON.parse(data.images); } catch { data.images = existingImages; }
      }
    } else {
      // No new images, keep existing
      data.images = existingImages;
    }
    if (data.itinerary && typeof data.itinerary === 'string') {
      data.itinerary = JSON.parse(data.itinerary);
    }
    if (data.inclusions && typeof data.inclusions === 'string') {
      data.inclusions = JSON.parse(data.inclusions);
    }
    if (data.languages && typeof data.languages === 'string') {
      data.languages = JSON.parse(data.languages);
    }
    if (data.availability && typeof data.availability === 'string') {
      data.availability = JSON.parse(data.availability);
    }
    const pkg = await TourPackageService.updateTourPackage(req.params.id, data);
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete tour package
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await TourPackageService.deleteTourPackage(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
