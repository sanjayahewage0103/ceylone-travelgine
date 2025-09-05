const BlogPost = require('../models/blogPost.model');

class BlogPostService {
  async createBlogPost(data) {
    // Accepts: title, subtitle, mainImage, sections, tags, status, author
    const post = new BlogPost(data);
    return await post.save();
  }
  async getBlogPostById(id) {
    return await BlogPost.findById(id).populate('author', 'name');
  }
  async getBlogPostsByGuide(guideId) {
    return await BlogPost.find({ author: guideId }).sort({ createdAt: -1 });
  }
  async getAllPublishedBlogPosts() {
    return await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
  }
  async updateBlogPost(id, data) {
    return await BlogPost.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteBlogPost(id) {
    return await BlogPost.findByIdAndDelete(id);
  }
}

module.exports = new BlogPostService();
