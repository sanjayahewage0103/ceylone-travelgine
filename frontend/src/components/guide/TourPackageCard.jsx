import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourPackageCard = ({ pkg, onClick, featured = false }) => {
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
  
  // Generate a tour badge based on type or category
  const getBadgeColor = () => {
    if (featured) return 'bg-amber-100 text-amber-800';
    switch(pkg.tourType?.toLowerCase()) {
      case 'adventure': return 'bg-orange-100 text-orange-800';
      case 'wildlife': return 'bg-green-100 text-green-800';
      case 'beach': return 'bg-blue-100 text-blue-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'historical': return 'bg-amber-100 text-amber-800';
      case 'nature': return 'bg-emerald-100 text-emerald-800';
      case 'city': return 'bg-slate-100 text-slate-800';
      default: return 'bg-teal-100 text-teal-800';
    }
  };
  
  return (
    <div 
      className={`group bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200 h-full ${featured ? 'ring-2 ring-amber-200 ring-offset-2 ring-offset-transparent' : ''}`}
      onClick={() => onClick ? onClick() : navigate(`/tours/${pkg._id}`)}
    >
      <div className={`relative ${featured ? 'aspect-square h-auto' : 'h-48'} w-full overflow-hidden`}>
        <img 
          src={mainImage} 
          alt={pkg.package_name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Status badge */}
        {pkg.status && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </span>
        )}
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3 flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </div>
        )}
        
        {/* Type badge */}
        {pkg.tourType && !featured && (
          <div className={`absolute top-3 left-3 flex items-center px-2.5 py-1 rounded-full ${getBadgeColor()} text-xs font-medium`}>
            {pkg.tourType}
          </div>
        )}
        
        {/* Favorite/heart icon placeholder */}
        <button 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-1.5 shadow-sm text-gray-400 hover:text-rose-500 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            // Implement favorite functionality
            console.log('Add to favorites:', pkg._id);
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" />
          </svg>
        </button>
      </div>
      
      <div className={`p-4 ${featured ? 'p-3' : ''}`}>
        <div className={`font-bold ${featured ? 'text-base' : 'text-lg'} mb-1 text-gray-800 line-clamp-2 group-hover:text-teal-700 transition-colors`}>
          {pkg.package_name}
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {pkg.duration && <span>{pkg.duration.replace('-', ' ')}</span>}
          {pkg.max_group_size && (
            <>
              <span className="mx-1.5">•</span>
              <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Up to {pkg.max_group_size}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <span className="text-amber-400 mr-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="font-medium text-gray-700">{pkg.rating || '4.8'}</span>
            <span className="text-gray-400 ml-1">({pkg.ratingCount || '12'})</span>
          </div>
          
          {/* Location info if available */}
          {pkg.district && (
            <div className="flex items-center ml-auto text-gray-500 text-xs">
              <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {pkg.district}
            </div>
          )}
        </div>
        
        {/* Price section */}
        <div className="flex items-end justify-between">
          <div>
            {pkg.old_price && (
              <span className="text-gray-400 line-through text-sm mr-1">LKR {parseInt(pkg.old_price).toLocaleString()}</span>
            )}
            <div className="flex items-baseline">
              <span className="text-teal-600 text-xl font-bold">LKR {parseInt(pkg.price_lkr).toLocaleString()}</span>
              <span className="text-gray-500 text-xs ml-1">per person</span>
            </div>
          </div>
          
          {/* View details button */}
          <button className="text-xs font-medium text-teal-600 hover:text-teal-800 flex items-center group-hover:underline">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Guide info */}
        {pkg.guide_id && (
          <div className="text-xs mt-3 pt-3 border-t border-gray-100 flex items-center">
            <span className="text-gray-500">Tour by:</span>
            <a 
              href={`/guides/${pkg.guide_id._id}`} 
              className="text-teal-600 hover:text-teal-800 font-medium ml-1 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {pkg.guide_id.fullName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPackageCard;
