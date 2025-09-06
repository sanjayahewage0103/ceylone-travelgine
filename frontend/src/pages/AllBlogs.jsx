
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/guide/BlogCard';
import axios from 'axios';
import MainNavbar from '../components/common/MainNavbar';
import { motion } from 'framer-motion'; // Make sure framer-motion is installed

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
  
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70 } }
  };

  return (
    <>
      <MainNavbar />
      {/* Background image with overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-[-1]" 
           style={{backgroundImage: "url('/images/travel-blog-bg.jpg')"}}> 
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/80 to-cyan-700/70 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative bg-grid-pattern">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-tr from-teal-300 to-cyan-400 opacity-50 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-bl from-teal-400 to-cyan-300 opacity-40 animate-float-slow-reverse"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-teal-300 to-cyan-500 opacity-30 animate-float-medium"></div>
      
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 py-12"
        >
          {/* Header section with glassmorphism */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl mb-12 p-8 relative overflow-hidden shadow-lg"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-teal-300/20 to-cyan-400/20 blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-300/20 to-teal-400/20 blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-4">Travel Stories & Experiences</h1>
                <p className="text-cyan-800/90 mb-6 max-w-xl">Explore our collection of authentic travel stories, guides and tips from passionate travelers across Ceylon.</p>
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`px-4 py-2 rounded-full border transition-all duration-300 ${selectedTag === '' ? 'btn-gradient shadow-md' : 'glass-card hover:bg-white/90 border-white/30'} text-sm`}
                    onClick={() => setSelectedTag('')}
                  >All Posts</button>
                  
                  {tags.map(tag => (
                    <button
                      key={tag}
                      className={`px-4 py-2 rounded-full border transition-all duration-300 ${selectedTag === tag ? 'btn-gradient shadow-md' : 'glass-card hover:bg-white/90 border-white/30'} text-sm`}
                      onClick={() => setSelectedTag(tag)}
                    >{tag}</button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    className="glass-card border-white/30 rounded-lg px-4 py-2 pl-10 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select 
                  value={sort} 
                  onChange={e => setSort(e.target.value)} 
                  className="glass-card border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="recent">Most Recent</option>
                  <option value="top">Top Rated</option>
                </select>
              </div>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center text-cyan-800 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Loading amazing travel stories...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-700/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-cyan-800">No blog posts found matching your criteria.</p>
              <p className="text-cyan-700 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filtered.map((blog, index) => (
                <motion.div key={blog._id} variants={item}>
                  <Link to={`/blogs/${blog._id}`} className="block h-full transform transition-all duration-300 hover:scale-[1.02]">
                    <BlogCard blog={blog} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
