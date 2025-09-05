import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../components/guide/BlogCard';

export default function GuideBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const guideId = window.localStorage.getItem('guideId');
  const token = window.localStorage.getItem('token');

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog-posts/guide/${guideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(res.data);
      } catch {
        setBlogs([]);
      }
      setLoading(false);
    }
    if (guideId && token) fetchBlogs();
  }, [guideId, token]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cyan-800">My Blogs</h1>
        <Link to="/guide/blogs/new" className="bg-cyan-700 text-white px-4 py-2 rounded font-semibold">Write Article</Link>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No blog posts yet.</div>
      ) : (
        <div className="space-y-6">
          {blogs.map(blog => (
            <Link to={`/guide/blogs/${blog._id}`} key={blog._id} className="block">
              <BlogCard blog={blog} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
