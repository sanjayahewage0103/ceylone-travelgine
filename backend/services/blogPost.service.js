// Removed stray top-level incrementViewCount
const BlogPost = require('../models/blogPost.model');

class BlogPostService {

  async incrementLikeCount(id) {
    return await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
  }

  async decrementLikeCount(id) {
    return await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { likes: -1 } },
      { new: true }
    );
  }
  async createBlogPost(data) {
    // Accepts: title, subtitle, mainImage, sections, tags, status, author
    const post = new BlogPost(data);
    return await post.save();
  }
  async getBlogPostById(id) {
    const post = await BlogPost.findById(id).populate('author', 'fullName role');
    if (!post) return null;
    let author = post.author;
    let profilePicUrl = null;
    if (author && author.role === 'guide') {
      // Lazy load Guide model to avoid circular deps
      const Guide = require('../models/guide.model');
      const guideProfile = await Guide.findOne({ userId: author._id });
      if (guideProfile && guideProfile.files && guideProfile.files.profilePicUrl) {
        profilePicUrl = guideProfile.files.profilePicUrl;
      }
    }
    // Compose author object
    post.author = {
      _id: author?._id,
      name: author?.fullName,
      profilePicture: profilePicUrl,
      role: author?.role
    };
    return post;
  }
  async getBlogPostsByGuide(guideId) {
    return await BlogPost.find({ author: guideId }).sort({ createdAt: -1 });
  }
  async getAllPublishedBlogPosts() {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 }).populate('author', 'fullName role');
    // For each post, attach author name and profilePic
    const Guide = require('../models/guide.model');
    return await Promise.all(posts.map(async post => {
      let author = post.author;
      let profilePicUrl = null;
      if (author && author.role === 'guide') {
        const guideProfile = await Guide.findOne({ userId: author._id });
        if (guideProfile && guideProfile.files && guideProfile.files.profilePicUrl) {
          profilePicUrl = guideProfile.files.profilePicUrl;
        }
      }
      post.author = {
        _id: author?._id,
        name: author?.fullName,
        profilePicture: profilePicUrl,
        role: author?.role
      };
      return post;
    }));
  }
  async updateBlogPost(id, data) {
    return await BlogPost.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteBlogPost(id) {
    return await BlogPost.findByIdAndDelete(id);
  }

  async incrementViewCount(id) {
    return await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  }
}

module.exports = new BlogPostService();
