import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const guideId = window.localStorage.getItem('guideId');
  const token = window.localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog-posts/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError('Blog not found');
      }
      setLoading(false);
    }
    fetchBlog();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await axios.delete(`/api/blog-posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/guide/blogs');
    } catch (err) {
      alert('Delete failed');
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cyan-900">{blog.title}</h1>
        {blog.author?._id === guideId && (
          <div className="flex gap-2">
            <Link to={`/guide/blogs/edit/${blog._id}`} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded font-semibold">Edit</Link>
            <button onClick={handleDelete} className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold">Delete</button>
          </div>
        )}
      </div>
      {blog.subtitle && <div className="text-lg text-cyan-700 mb-2">{blog.subtitle}</div>}
      <div className="text-gray-400 text-sm mb-4">
        {blog.updatedAt && blog.updatedAt !== blog.createdAt ? (
          <>
            <span>Last updated: {new Date(blog.updatedAt).toLocaleString()}</span>
            <span className="ml-2 text-xs text-gray-300">(Created: {new Date(blog.createdAt).toLocaleString()})</span>
          </>
        ) : (
          <>Published: {new Date(blog.createdAt).toLocaleString()}</>
        )}
      </div>
      {blog.mainImage && (
        <img src={getImageUrl(blog.mainImage)} alt="Main" className="rounded mb-6 w-full max-h-96 object-cover" />
      )}
      <div className="space-y-8">
        {blog.sections && blog.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4">
            {section.subtitle && <div className="text-lg font-semibold mb-2">{section.subtitle}</div>}
            <div className="text-gray-800 whitespace-pre-line mb-2">{section.content}</div>
            {section.image && (
              <img src={getImageUrl(section.image)} alt="Section" className="rounded mt-2 max-h-60" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
