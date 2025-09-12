


const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const BlogPostService = require('../services/blogPost.service');
const upload = require('../config/upload');
const path = require('path');


// Create blog post (guide only)
// Accepts: mainImage (single), sectionImages (array), sections (JSON string)
router.post('/', authenticate, upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'sectionImages' }
]), async (req, res) => {
  try {
    const { title, subtitle, status, tags } = req.body;
    let sections = [];
    if (req.body.sections) {
      sections = JSON.parse(req.body.sections);
    }
    // Attach section images
    if (req.files && req.files['sectionImages']) {
      req.files['sectionImages'].forEach((file, idx) => {
        if (sections[idx]) {
          sections[idx].image = `/uploads/${file.filename}`;
        }
      });
    }
    // Main image
    let mainImage = '';
    if (req.files && req.files['images'] && req.files['images'][0]) {
      mainImage = `/uploads/${req.files['images'][0].filename}`;
    }
    // Tags
    let tagsArr = [];
    if (tags) {
      if (Array.isArray(tags)) tagsArr = tags;
      else tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    const data = {
      title,
      subtitle,
      mainImage,
      sections,
      tags: tagsArr,
      status,
      author: req.user.id
    };
    const post = await BlogPostService.createBlogPost(data);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get blog post by id (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPostService.getBlogPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/blog-posts called');
    const posts = await BlogPostService.getAllPublishedBlogPosts();
    console.log('Published blog posts returned:', posts);
    res.json(posts);
  } catch (err) {
    console.error('Error in GET /api/blog-posts:', err);
    res.status(500).json({ error: err.message });
  }
});

// List blog posts by guide (private)
router.get('/guide/:guideId', authenticate, async (req, res) => {
  try {
    if (req.user.id !== req.params.guideId) return res.status(403).json({ error: 'Forbidden' });
    const posts = await BlogPostService.getBlogPostsByGuide(req.params.guideId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog post (guide only)
// Accepts: mainImage (single), sectionImages (array), sections (JSON string)
router.put('/:id', authenticate, upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'sectionImages' }
]), async (req, res) => {
  try {
    const post = await BlogPostService.getBlogPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author._id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { title, subtitle, status, tags } = req.body;
    let sections = [];
    if (req.body.sections) {
      sections = JSON.parse(req.body.sections);
    }
    // Attach section images
    if (req.files && req.files['sectionImages']) {
      req.files['sectionImages'].forEach((file, idx) => {
        if (sections[idx]) {
          sections[idx].image = `/uploads/${file.filename}`;
        }
      });
    }
    // Main image
    let mainImage = post.mainImage; // Keep existing if not updated
    if (req.files && req.files['images'] && req.files['images'][0]) {
      mainImage = `/uploads/${req.files['images'][0].filename}`;
    }
    // Tags
    let tagsArr = [];
    if (tags) {
      if (Array.isArray(tags)) tagsArr = tags;
      else tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    const data = {
      title,
      subtitle,
      mainImage,
      sections,
      tags: tagsArr,
      status,
      author: req.user.id
    };
    const updated = await BlogPostService.updateBlogPost(req.params.id, data);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete blog post (guide only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await BlogPostService.getBlogPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author._id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await BlogPostService.deleteBlogPost(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
