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

  // Example background image (replace with your own or fetch from backend if available)
  const backgroundImage = guide.profileBgImage || '/public/3.jpg';

  return (
    <div
      className="min-h-screen py-10 px-2"
      style={{
        background: `linear-gradient(120deg, rgba(0,212,255,0.15) 0%, rgba(9,121,113,0.10) 100%), url('${backgroundImage}') center/cover no-repeat fixed`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-xl bg-white/70 border border-white/30">
        {/* Banner and profile picture */}
        <div className="relative h-56 bg-gradient-to-r from-cyan-400 to-teal-400">
          {guide.bannerImage && <img src={guide.bannerImage} alt="Banner" className="w-full h-56 object-cover" />}
          <div className="absolute left-8 -bottom-16 flex items-end">
            <img src={guide.profilePicture ? guide.profilePicture : '/default-profile.png'} alt="Profile" className="w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover bg-white/80" />
          </div>
        </div>
        <div className="pt-20 px-8 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-cyan-900 mb-1 drop-shadow">{guide.name}</h2>
            <div className="text-cyan-700 font-medium mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full"></span>
              {guide.location}
            </div>
            <div className="text-gray-700 mb-4 max-w-xl font-medium italic">{guide.bio}</div>
            <div className="flex flex-wrap gap-2 text-xs text-cyan-800/80 mb-2">
              {guide.languages && guide.languages.map((lang, i) => <span key={i} className="bg-cyan-100 px-2 py-1 rounded-full shadow-sm border border-cyan-200">{lang}</span>)}
            </div>
            <div className="text-sm text-gray-500">Contact: <span className="font-semibold text-cyan-700">{guide.contact}</span></div>
            {guide.rating && (
              <div className="mt-2 flex items-center gap-1 text-yellow-500 text-lg">
                {'★'.repeat(Math.round(guide.rating))}
                <span className="text-gray-500 text-sm ml-1">({guide.rating.toFixed(1)})</span>
              </div>
            )}
            {guide.specialities && guide.specialities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {guide.specialities.map((spec, i) => (
                  <span key={i} className="bg-gradient-to-r from-cyan-200 to-green-200 text-cyan-900 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">{spec}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Blogs Section */}
        <div className="px-8 pb-8">
          <h3 className="text-2xl font-bold mb-4 text-cyan-800">Blogs by this Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.blogs && guide.blogs.length > 0 ? guide.blogs.map(blog => (
              <div key={blog._id} className="bg-white/90 rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-all border border-white/40">
                <img src={blog.mainImage || '/default-blog.jpg'} alt="Blog Cover" className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <a href={`/blogs/${blog._id}`} className="text-lg font-bold text-cyan-700 hover:underline">{blog.title}</a>
                  <div className="text-xs text-gray-400 mt-1">{new Date(blog.createdAt).toLocaleDateString()}</div>
                  {blog.summary && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{blog.summary}</div>}
                </div>
              </div>
            )) : <div className="text-gray-400">No blogs yet.</div>}
          </div>
        </div>
        {/* Tour Packages Section */}
        <div className="px-8 pb-10">
          <h3 className="text-2xl font-bold mb-4 text-cyan-800">Tour Packages I Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.tourPackages && guide.tourPackages.length > 0 ? guide.tourPackages.map(tour => (
              <div key={tour._id} className="bg-white/90 rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-all border border-white/40">
                <img src={(tour.images && tour.images[0]) || '/default-tour.jpg'} alt="Tour Cover" className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <a href={`/tours/${tour._id}`} className="text-lg font-bold text-cyan-700 hover:underline">{tour.package_name}</a>
                  <div className="text-xs text-gray-400 mt-1">LKR {tour.price_lkr}</div>
                  <div className="text-xs mt-2">
                    Guide: <a href={`/guides/${guide.id}`} className="text-cyan-700 hover:underline font-semibold">{guide.name}</a>
                  </div>
                  {tour.description && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{tour.description}</div>}
                </div>
              </div>
            )) : <div className="text-gray-400">No tour packages yet.</div>}
          </div>
        </div>
        {/* Add more sections if backend provides: reviews, awards, gallery, etc. */}
        {guide.reviews && guide.reviews.length > 0 && (
          <div className="px-8 pb-10">
            <h3 className="text-2xl font-bold mb-4 text-cyan-800">Reviews</h3>
            <div className="space-y-4">
              {guide.reviews.map((review, i) => (
                <div key={i} className="bg-white/80 rounded-xl shadow p-4">
                  <div className="font-semibold text-cyan-700">{review.author}</div>
                  <div className="text-yellow-500">{'★'.repeat(Math.round(review.rating))}</div>
                  <div className="text-gray-600 mt-1">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {guide.gallery && guide.gallery.length > 0 && (
          <div className="px-8 pb-10">
            <h3 className="text-2xl font-bold mb-4 text-cyan-800">Gallery</h3>
            <div className="flex flex-wrap gap-4">
              {guide.gallery.map((img, i) => (
                <img key={i} src={img} alt="Gallery" className="w-32 h-32 object-cover rounded-xl shadow" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuideProfile;
