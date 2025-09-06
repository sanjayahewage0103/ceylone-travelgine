import React from 'react';
import { getImageUrl } from '../../utils/imageUrl';
import { motion } from 'framer-motion'; // Make sure framer-motion is installed

// Modern BlogCard with glassmorphism effect
export default function BlogCard({ blog }) {
  // Debug log to check blog prop
  console.log('BlogCard blog prop:', blog);
  
  // Placeholder values for likes, comments, shares, and rating
  const likes = blog.likes || 0;
  const comments = blog.comments || 0;
  const shares = blog.shares || 0;
  const rating = blog.rating || 0;
  
  // Default image if none provided
  const defaultImage = '/images/default-blog-image.jpg';
  const imageUrl = blog.mainImage ? getImageUrl(blog.mainImage) : defaultImage;
  
  // Calculate read time (rough estimation)
  const getReadTime = () => {
    let text = '';
    if (blog.sections && blog.sections.length > 0) {
      text = blog.sections.map(s => s.content || '').join(' ');
    }
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute
    return `${readTime} min read`;
  };
  
  // Format date to be more user friendly
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden h-full relative group">
      {/* Decorative gradient spots */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-teal-300/20 rounded-full blur-xl opacity-70 z-0 transition-all duration-700 group-hover:scale-125"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-teal-300/20 to-cyan-400/20 rounded-full blur-xl opacity-70 z-0 transition-all duration-700 group-hover:scale-110"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Image section with overlay */}
        <div className="w-full h-52 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <img 
            src={imageUrl} 
            alt={blog.title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Tags positioned on the image */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="absolute top-4 right-4 z-20 flex flex-wrap justify-end gap-2">
              {blog.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="glass-card text-xs px-2.5 py-1 rounded-full text-cyan-900 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 2 && (
                <span className="glass-card text-xs px-2.5 py-1 rounded-full text-cyan-900 backdrop-blur-md">
                  +{blog.tags.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* Publication date & read time */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <span className="glass-card text-xs px-3 py-1.5 rounded-full text-white backdrop-blur-md flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(blog.createdAt)}
            </span>
            
            <span className="glass-card text-xs px-3 py-1.5 rounded-full text-white backdrop-blur-md flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getReadTime()}
            </span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          {/* Blog title and subtitle */}
          <div>
            <h2 className="text-xl font-bold text-cyan-800 mb-2 line-clamp-2 group-hover:text-gradient transition-all duration-300">
              {blog.title}
            </h2>
            
            {blog.subtitle && (
              <h3 className="text-cyan-700 font-medium mb-3 line-clamp-1">{blog.subtitle}</h3>
            )}
            
            {blog.sections && blog.sections[0]?.content && (
              <p className="text-cyan-900/80 text-sm mb-4 line-clamp-2">
                {blog.sections[0].content}
              </p>
            )}
          </div>
          
          {/* Author and metrics */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {blog.author?.profilePicture ? (
                <img 
                  src={getImageUrl(blog.author.profilePicture)} 
                  alt={blog.author?.name || 'Author'} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {blog.author?.name ? blog.author.name.charAt(0) : 'G'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-cyan-800">
                  {blog.author?.name || 'Ceylon Guide'}
                </p>
                <p className="text-xs text-cyan-600/70">
                  {blog.author?.title || 'Travel Expert'}
                </p>
              </div>
            </div>
            
            {/* Engagement metrics with hover animations */}
            <div className="flex items-center justify-between pt-3 border-t border-cyan-900/10">
              <div className="flex items-center gap-4 text-cyan-700">
                <span className="flex items-center gap-1.5 text-sm group-hover:text-cyan-600 transition-colors">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905v.714L7.118 9.2A.5.5 0 006.5 9h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1" />
                  </svg>
                  {likes}
                </span>
                <span className="flex items-center gap-1.5 text-sm group-hover:text-cyan-600 transition-colors">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {comments}
                </span>
                <span className="flex items-center gap-1.5 text-sm group-hover:text-cyan-600 transition-colors">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {shares}
                </span>
              </div>
              
              {/* Rating stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors group-hover:text-yellow-400`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
