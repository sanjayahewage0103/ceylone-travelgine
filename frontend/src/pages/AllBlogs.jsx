import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/guide/BlogCard';
import axios from 'axios';

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await axios.get('/api/blog-posts');
        console.log('DEBUG /api/blog-posts response:', res.data);
        setBlogs(res.data);
        // Collect unique tags
        const tagSet = new Set();
        res.data.forEach(b => b.tags && b.tags.forEach(t => tagSet.add(t)));
        setTags(Array.from(tagSet));
        // Debug: log blogs after fetch
        setTimeout(() => {
          console.log('AllBlogs raw blogs:', res.data);
        }, 0);
      } catch {
        setBlogs([]);
        setTags([]);
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  // Filter and sort blogs
  const filtered = blogs
    .filter(b => {
      // Defensive: ensure title/subtitle are strings
      const title = typeof b.title === 'string' ? b.title : '';
      const subtitle = typeof b.subtitle === 'string' ? b.subtitle : '';
      // Defensive: ensure tags is an array
      const tagsArr = Array.isArray(b.tags) ? b.tags : [];
      // Search filter
      const matchesSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || subtitle.toLowerCase().includes(search.toLowerCase());
      // Tag filter
      const matchesTag = !selectedTag || tagsArr.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'top') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  // Debug log to check what blogs are being rendered
  console.log('AllBlogs filtered blogs:', filtered);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">All Blogs</h1>
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-3 py-1 rounded-full border ${selectedTag === '' ? 'bg-cyan-700 text-white' : 'bg-white text-cyan-700 border-cyan-700'} text-sm`}
              onClick={() => setSelectedTag('')}
            >All</button>
            {tags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border ${selectedTag === tag ? 'bg-cyan-700 text-white' : 'bg-white text-cyan-700 border-cyan-700'} text-sm`}
                onClick={() => setSelectedTag(tag)}
              >{tag}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search blogs..."
            className="border rounded px-3 py-2 min-w-[180px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-2 py-2">
            <option value="recent">Most Recent</option>
            <option value="top">Top Rated</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(blog => (
            <Link to={`/guide/blogs/${blog._id}`} key={blog._id} className="block">
              <BlogCard blog={blog} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
