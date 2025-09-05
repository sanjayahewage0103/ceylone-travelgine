import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourPackageCard = ({ pkg, onClick }) => {
  const navigate = useNavigate();
  let mainImage = '/placeholder.jpg';
  if (pkg.images && pkg.images.length > 0) {
    mainImage = pkg.images[0];
    if (mainImage) {
      if (mainImage.startsWith('/uploads/')) {
        if (import.meta.env.DEV) {
          mainImage = `http://localhost:5000${mainImage}`;
        }
      } else if (mainImage.startsWith('uploads/')) {
        mainImage = '/'+mainImage;
        if (import.meta.env.DEV) {
          mainImage = `http://localhost:5000${mainImage}`;
        }
      } else if (!mainImage.startsWith('http') && !mainImage.startsWith('/')) {
        mainImage = `/uploads/${mainImage}`;
        if (import.meta.env.DEV) {
          mainImage = `http://localhost:5000${mainImage}`;
        }
      }
    }
  }
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden border" onClick={() => onClick ? onClick() : navigate(`/tours/${pkg._id}`)}>
      <div className="relative h-48 w-full overflow-hidden">
        <img src={mainImage} alt={pkg.package_name} className="object-cover w-full h-full" />
        {/* Status badge */}
        {pkg.status && (
          <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${pkg.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </span>
        )}
        {/* Favorite/heart icon placeholder */}
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" /></svg>
        </button>
      </div>
      <div className="p-4">
        <div className="font-bold text-lg mb-1">{pkg.package_name}</div>
        <div className="text-gray-600 text-sm mb-2">
          {pkg.duration && <span>{pkg.duration.replace('-', ' ')}</span>}
          {pkg.max_group_size && <span> • Up to {pkg.max_group_size} people</span>}
        </div>
        <div className="flex items-center mb-2">
          {/* Star rating placeholder */}
          <span className="text-yellow-500 mr-1">★</span>
          <span className="font-semibold">{pkg.rating || '4.8'}</span>
          <span className="text-gray-400 ml-1">({pkg.ratingCount || '0'})</span>
        </div>
        <div className="flex items-end gap-2">
          {pkg.old_price && <span className="text-gray-400 line-through text-sm">${pkg.old_price}</span>}
          <span className="text-rose-600 text-xl font-bold">${pkg.price_lkr}</span>
          <span className="text-gray-500 text-xs">per person</span>
        </div>
      </div>
    </div>
  );
};

export default TourPackageCard;
