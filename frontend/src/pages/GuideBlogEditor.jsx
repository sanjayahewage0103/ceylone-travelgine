
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainNavbar from '../components/common/MainNavbar';
import GuideSidebar from '../components/guide/GuideSidebar';



function GuideBlogEditor({ editMode }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [sections, setSections] = useState([
    { subtitle: '', content: '', image: null, imagePreview: null }
  ]);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const guideId = window.localStorage.getItem('guideId');
  const token = window.localStorage.getItem('token');

  useEffect(() => {
    if (editMode && id) {
      (async () => {
        try {
          const res = await axios.get(`/api/blog-posts/${id}`);
          const blog = res.data;
          setTitle(blog.title || '');
          setSubtitle(blog.subtitle || '');
          setMainImagePreview(blog.mainImage || null);
          setSections(
            blog.sections && blog.sections.length > 0
              ? blog.sections.map(s => ({ ...s, imagePreview: s.image || null, image: null }))
              : [{ subtitle: '', content: '', image: null, imagePreview: null }]
          );
          setTags(blog.tags ? blog.tags.join(', ') : '');
          setStatus(blog.status || 'draft');
        } catch (err) {
          setError('Failed to load blog for editing');
        }
      })();
    }
  }, [editMode, id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setMainImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setMainImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setMainImagePreview(null);
    }
  }

  function handleSectionChange(idx, field, value) {
    setSections(sections => sections.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function handleSectionImage(idx, e) {
    const file = e.target.files[0];
    setSections(sections => sections.map((s, i) => {
      if (i !== idx) return s;
      let imagePreview = null;
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => setSections(sections => sections.map((ss, ii) => ii === idx ? { ...ss, imagePreview: ev.target.result } : ss));
        reader.readAsDataURL(file);
      }
      return { ...s, image: file, imagePreview };
    }));
  }

  function addSection() {
    setSections(sections => [...sections, { subtitle: '', content: '', image: null, imagePreview: null }]);
  }

  function removeSection(idx) {
    setSections(sections => sections.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('status', status);
      formData.append('author', guideId);
      tags.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => formData.append('tags', tag));
      if (mainImage) formData.append('images', mainImage);
      // Sections
      formData.append('sections', JSON.stringify(sections.map(({ subtitle, content }) => ({ subtitle, content }))));
      sections.forEach((section, idx) => {
        if (section.image) formData.append(`sectionImages`, section.image);
      });
      if (editMode && id) {
        await axios.put(`/api/blog-posts/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/blog-posts', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/guide/blogs');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="flex">
        <GuideSidebar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Always visible main title */}
            <div className="sticky top-0 bg-gray-50 z-10 pb-2 border-b mb-4">
              <input
                className="w-full border-0 border-b-2 border-cyan-700 bg-transparent text-3xl font-bold focus:ring-0 focus:border-cyan-700 mb-1"
                placeholder="Article Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ outline: 'none' }}
              />
              <input
                className="w-full border-0 border-b border-gray-300 bg-transparent text-lg font-medium focus:ring-0 focus:border-cyan-400"
                placeholder="Subtitle (optional)"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
              />
            </div>
            {/* Main image upload */}
            <div>
              <label className="block font-medium mb-1">Main Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {mainImagePreview && (
                <img src={mainImagePreview} alt="Preview" className="mt-2 rounded max-h-56" />
              )}
            </div>
            {/* Article sections */}
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 relative">
                  <button type="button" className="absolute top-2 right-2 text-red-500" onClick={() => removeSection(idx)} disabled={sections.length === 1}>×</button>
                  <input
                    className="w-full border-0 border-b border-gray-300 bg-transparent text-lg font-semibold mb-2 focus:ring-0 focus:border-cyan-400"
                    placeholder="Section Subtitle (optional)"
                    value={section.subtitle}
                    onChange={e => handleSectionChange(idx, 'subtitle', e.target.value)}
                  />
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-[120px]"
                    placeholder="Section content..."
                    value={section.content}
                    onChange={e => handleSectionChange(idx, 'content', e.target.value)}
                    required
                  />
                  <div className="mt-2">
                    <label className="block font-medium mb-1">Section Image</label>
                    <input type="file" accept="image/*" onChange={e => handleSectionImage(idx, e)} />
                    {section.imagePreview && (
                      <img src={section.imagePreview} alt="Preview" className="mt-2 rounded max-h-40" />
                    )}
                  </div>
                </div>
              ))}
              <button type="button" className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded font-semibold mt-2" onClick={addSection}>+ Add Section</button>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            <div className="flex gap-4 items-center">
              <label>Status:</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-2 py-1">
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" className="bg-cyan-700 text-white px-6 py-2 rounded font-semibold" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default GuideBlogEditor;
