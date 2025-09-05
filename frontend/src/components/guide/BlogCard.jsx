import React from 'react';
import { getImageUrl } from '../../utils/imageUrl';

// BlogCard: Professional Medium-style card for blog previews
export default function BlogCard({ blog }) {
  // Debug log to check blog prop
  console.log('BlogCard blog prop:', blog);
  // Placeholder values for likes, comments, shares, and rating
  const likes = blog.likes || 0;
  const comments = blog.comments || 0;
  const shares = blog.shares || 0;
  const rating = blog.rating || 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-0 overflow-hidden flex flex-col md:flex-row">
      {blog.mainImage && (
        <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden flex-shrink-0">
          <img src={getImageUrl(blog.mainImage)} alt="Blog main" className="object-cover w-full h-full" />
        </div>
      )}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            {blog.updatedAt && blog.updatedAt !== blog.createdAt ? (
              <>
                <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()} {new Date(blog.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="ml-1 text-gray-300">(Created: {new Date(blog.createdAt).toLocaleDateString()})</span>
              </>
            ) : (
              <span>Published: {new Date(blog.createdAt).toLocaleDateString()} {new Date(blog.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          <div className="text-xl font-bold text-cyan-900 mb-1 line-clamp-2">{blog.title}</div>
          {blog.subtitle && <div className="text-cyan-700 font-medium mb-2 line-clamp-1">{blog.subtitle}</div>}
          {blog.sections && blog.sections[0]?.content && (
            <div className="text-gray-700 text-sm mb-3 line-clamp-3">{blog.sections[0].content}</div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>👍 {likes}</span>
            <span>💬 {comments}</span>
            <span>↗️ {shares}</span>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
