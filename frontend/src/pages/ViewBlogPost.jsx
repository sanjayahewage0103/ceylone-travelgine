
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';
import BlogCard from '../components/guide/BlogCard';
import Footer from '../components/common/Footer';

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
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog-posts/${id}`);
        setBlog(res.data);
        setViews(res.data.views || 0);
        setLikes(res.data.likes || 0);
        // Fetch related blogs (by tag or recent)
        const relRes = await axios.get('/api/blog-posts');
        let rel = relRes.data.filter(b => b._id !== res.data._id);
        if (res.data.tags && res.data.tags.length > 0) {
          rel = rel.filter(b => b.tags && b.tags.some(t => res.data.tags.includes(t)));
        }
        setRelated(rel.slice(0, 4));
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

  const authorName = blog.author?.name || 'Unknown Guide';
  const authorId = blog.author?._id;
  const authorProfilePic = blog.author?.profilePicture ? getImageUrl(blog.author.profilePicture) : '/default-profile.png';
  const publishedDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <>
      {/* Background image with glass overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-[-1]" style={{backgroundImage: "url('/3.jpg')"}}>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/80 to-cyan-700/70 backdrop-blur-md"></div>
      </div>

      <div className="min-h-screen flex flex-col justify-between">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-8 w-full">
          {/* Back button */}
          <div className="mb-4 flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="text-cyan-700 hover:underline text-sm">← Back</button>
            <Link to="/blogs" className="text-cyan-700 hover:underline text-sm">All Blogs</Link>
          </div>

          {/* Glassmorphism Article Container */}
          <article className="glass-card rounded-3xl shadow-2xl p-6 sm:p-10 mb-10 relative overflow-hidden">
            {/* Banner image */}
            {blog.mainImage && (
              <img src={getImageUrl(blog.mainImage)} alt="Main" className="rounded-2xl w-full max-h-96 object-cover mb-6 border border-white/30 shadow-lg" />
            )}
            {/* Title & subtitle */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2 leading-tight">{blog.title}</h1>
            {blog.subtitle && <div className="text-cyan-700 font-medium mb-4 text-lg">{blog.subtitle}</div>}
            {/* Author & meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-cyan-900/80 mb-6">
              <span className="flex items-center gap-1">
                <img src={authorProfilePic} alt="Guide" className="w-7 h-7 rounded-full border border-cyan-200 mr-1" />
                <Link to={authorId ? `/guides/${authorId}` : '#'} className="font-semibold hover:underline text-cyan-800">{authorName}</Link>
              </span>
              <span>• {publishedDate}</span>
              <span>• {views} Views</span>
              <span>• {likes} Likes</span>
              {blog.tags && blog.tags.length > 0 && (
                <span className="flex gap-1 flex-wrap ml-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="glass-card px-2 py-1 rounded-full text-xs text-cyan-900 border border-cyan-200/40">{tag}</span>
                  ))}
                </span>
              )}
            </div>

            {/* Like, Copy, Share buttons */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                className="text-xs px-3 py-1.5 rounded-full glass-card border border-cyan-200/40 hover:bg-white/80 text-cyan-800 font-semibold transition"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >{copied ? 'Copied!' : 'Copy Link'}</button>
              <button
                className={`text-xs px-3 py-1.5 rounded-full glass-card border border-cyan-200/40 font-semibold transition ${likeLoading ? 'opacity-60' : 'hover:bg-cyan-100/80'}`}
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
                className={`text-xs px-3 py-1.5 rounded-full glass-card border border-red-200/40 text-red-700 font-semibold transition ${likeLoading ? 'opacity-60' : 'hover:bg-red-100/80'}`}
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

            {/* Article content */}
            <div className="prose prose-cyan max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-white/30 prose-headings:text-cyan-900 prose-p:text-cyan-900 prose-strong:text-cyan-800 prose-a:text-teal-700 prose-a:underline prose-a:decoration-dotted prose-blockquote:border-teal-400/40 prose-blockquote:bg-teal-50/40 prose-blockquote:rounded-xl prose-blockquote:p-4 prose-blockquote:font-medium prose-blockquote:text-cyan-800 prose-li:marker:text-cyan-400 prose-code:bg-cyan-50 prose-code:text-cyan-800 prose-code:rounded px-1">
              {blog.sections && blog.sections.length > 0 && (
                <>
                  {blog.sections.slice(0, showFull ? blog.sections.length : 1).map((section, idx) => (
                    <section key={idx} className="mb-8">
                      {section.subtitle && <h2 className="text-2xl font-bold mb-2 text-cyan-800">{section.subtitle}</h2>}
                      <div className="whitespace-pre-line mb-2">{section.content}</div>
                      {section.image && (
                        <img src={getImageUrl(section.image)} alt="Section" className="rounded-xl mt-4 max-h-80 w-full object-cover border border-white/30" />
                      )}
                    </section>
                  ))}
                  {blog.sections.length > 1 && !showFull && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setShowFull(true)}
                        className="px-6 py-2 btn-gradient rounded-full font-semibold shadow-md hover:scale-105 transition"
                      >Read Full Article</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </article>

          {/* Related blogs section */}
          {related.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-cyan-900 mb-6">More Travel Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map(b => (
                  <Link to={`/blogs/${b._id}`} key={b._id} className="block h-full">
                    <BlogCard blog={b} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
