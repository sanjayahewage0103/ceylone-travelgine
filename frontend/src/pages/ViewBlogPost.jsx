import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';

export default function ViewBlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFull, setShowFull] = useState(false);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog-posts/${id}`);
  setBlog(res.data);
  setViews(res.data.views || 0);
  setLikes(res.data.likes || 0);
      } catch (err) {
        setError('Blog not found');
      }
      setLoading(false);
    }
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (showFull && blog && blog._id && views === (blog.views || 0)) {
      axios.patch(`/api/blog-posts/${blog._id}/view`).then(res => {
        if (typeof res.data.views === 'number') setViews(res.data.views);
      }).catch(() => {});
    }
    // eslint-disable-next-line
  }, [showFull]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!blog) return null;

  const duration = blog.duration || '6 Days';
  const authorName = blog.author?.name || 'Unknown Guide';
  const authorId = blog.author?._id;
  const authorProfilePic = blog.author?.profilePicture || '/default-profile.png';
  const publishedDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-cyan-700 hover:underline text-sm">← Back</button>
      </div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-900 mb-1">{blog.title}</h1>
            {blog.subtitle && <div className="text-cyan-700 font-medium mb-2 text-lg">{blog.subtitle}</div>}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <a href={authorId ? `/guides/${authorId}` : '#'} className="flex items-center group">
                  <img src={authorProfilePic} alt="Guide" className="w-5 h-5 rounded-full border border-gray-300 mr-1" />
                  <span className="text-cyan-700 group-hover:underline font-semibold">{authorName}</span>
                </a>
              </span>
              <span>• Published: {publishedDate}</span>
              <span>• {views} Views</span>
              <span>• {likes} Likes</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >{copied ? 'Copied!' : 'Copy Link'}</button>
            <button
              className={`text-xs px-2 py-1 rounded ${likeLoading ? 'bg-gray-200' : 'bg-cyan-100 hover:bg-cyan-200'} text-cyan-800 border border-cyan-200 font-semibold`}
              disabled={likeLoading}
              onClick={async () => {
                setLikeLoading(true);
                try {
                  const res = await axios.patch(`/api/blog-posts/${blog._id}/like`);
                  setLikes(res.data.likes);
                } catch {}
                setLikeLoading(false);
              }}
            >👍 Like</button>
            <button
              className={`text-xs px-2 py-1 rounded ${likeLoading ? 'bg-gray-200' : 'bg-red-100 hover:bg-red-200'} text-red-700 border border-red-200 font-semibold`}
              disabled={likeLoading}
              onClick={async () => {
                setLikeLoading(true);
                try {
                  const res = await axios.patch(`/api/blog-posts/${blog._id}/dislike`);
                  setLikes(res.data.likes);
                } catch {}
                setLikeLoading(false);
              }}
            >👎 Dislike</button>
          </div>
        </div>
        {blog.mainImage && (
          <img src={getImageUrl(blog.mainImage)} alt="Main" className="rounded-xl w-full max-h-96 object-cover border" />
        )}
      </div>
      {/* Content sections with Read More */}
      <div className="space-y-8">
        {blog.sections && blog.sections.length > 0 && (
          <>
            {blog.sections.slice(0, showFull ? blog.sections.length : 1).map((section, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4">
                {section.subtitle && <div className="text-lg font-semibold mb-2">{section.subtitle}</div>}
                <div className="text-gray-800 whitespace-pre-line mb-2">{section.content}</div>
                {section.image && (
                  <img src={getImageUrl(section.image)} alt="Section" className="rounded mt-2 max-h-60" />
                )}
              </div>
            ))}
            {blog.sections.length > 1 && !showFull && (
              <div className="text-center">
                <button
                  onClick={() => setShowFull(true)}
                  className="mt-4 px-4 py-2 bg-cyan-700 text-white rounded-full font-semibold hover:bg-cyan-800 transition"
                >Read More</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
