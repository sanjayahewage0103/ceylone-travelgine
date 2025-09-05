import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GuideProfile() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/guides/${id}`)
      .then(res => res.json())
      .then(data => {
        setGuide(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load guide profile.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!guide) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-8">
      {/* Banner and profile picture */}
      <div className="relative h-48 bg-gray-200">
        {guide.bannerImage && <img src={guide.bannerImage} alt="Banner" className="w-full h-48 object-cover" />}
        <div className="absolute left-8 -bottom-12">
          <img src={guide.profilePicture ? guide.profilePicture : '/default-profile.png'} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
        </div>
      </div>
      <div className="pt-16 px-8 pb-8">
        <h2 className="text-3xl font-bold text-gray-800">{guide.name}</h2>
        <p className="text-gray-500 mt-2">{guide.location}</p>
        <p className="mt-4 text-gray-700">{guide.bio}</p>
        <div className="mt-4 text-sm text-gray-400">Contact: {guide.contact}</div>
      </div>
      {/* Blogs Section */}
      <div className="px-8 pb-8">
        <h3 className="text-xl font-semibold mb-2">Blogs by this Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.blogs && guide.blogs.length > 0 ? guide.blogs.map(blog => (
            <div key={blog._id} className="bg-slate-50 rounded-lg shadow p-4 flex items-center">
              <img src={blog.mainImage || '/default-blog.jpg'} alt="Blog Cover" className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <a href={`/blogs/${blog._id}`} className="text-lg font-bold text-cyan-700 hover:underline">{blog.title}</a>
                <div className="text-xs text-gray-400 mt-1">{new Date(blog.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          )) : <div className="text-gray-400">No blogs yet.</div>}
        </div>
      </div>
      {/* Tour Packages Section */}
      <div className="px-8 pb-8">
        <h3 className="text-xl font-semibold mb-2">Tour Packages I Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.tourPackages && guide.tourPackages.length > 0 ? guide.tourPackages.map(tour => (
            <div key={tour._id} className="bg-slate-50 rounded-lg shadow p-4 flex items-center">
              <img src={(tour.images && tour.images[0]) || '/default-tour.jpg'} alt="Tour Cover" className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <a href={`/tours/${tour._id}`} className="text-lg font-bold text-cyan-700 hover:underline">{tour.package_name}</a>
                <div className="text-xs text-gray-400 mt-1">LKR {tour.price_lkr}</div>
              </div>
            </div>
          )) : <div className="text-gray-400">No tour packages yet.</div>}
        </div>
      </div>
    </div>
  );
}

export default GuideProfile;
