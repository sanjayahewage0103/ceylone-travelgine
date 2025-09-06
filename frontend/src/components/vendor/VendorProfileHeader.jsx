import React from 'react';

const getImageUrl = (url, fallback) => {
  if (!url) return fallback;
  return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const VendorProfileHeader = ({ vendor, onEdit }) => (
  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
    <div className="relative w-full md:w-auto">
      <div className="w-full md:w-[420px] h-52 rounded-xl overflow-hidden shadow-xl border border-green-200/50 backdrop-blur-sm">
        {/* Decorative accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-yellow-400/10 to-green-400/20 mix-blend-overlay z-10"></div>
        
        {/* Banner image */}
        <img 
          src={getImageUrl(vendor.profileBanner, '/default-banner.jpg')} 
          alt="Banner" 
          className="w-full h-full object-cover transition-all duration-700 hover:scale-105 filter brightness-[1.02]" 
        />
        
        {/* Banner overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Edit banner button */}
      <button 
        className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2.5 shadow-lg 
        hover:bg-green-50 transition-all duration-200 z-20 border border-green-100/50 hover:scale-110" 
        title="Edit Banner" 
        onClick={onEdit}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      
      {/* Profile image */}
      <div className="absolute left-6 -bottom-14 z-20">
        <div className="relative">
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-yellow-300 -m-1 blur-sm opacity-50"></div>
          
          {/* Profile container */}
          <div className="w-32 h-32 rounded-full border-4 border-white/90 overflow-hidden shadow-xl bg-white relative">
            <img 
              src={getImageUrl(vendor.files?.logoUrl, '/default-profile.png')} 
              alt="Profile" 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110 filter brightness-105" 
            />
          </div>
          
          {/* Edit profile button */}
          <button 
            className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg 
            hover:bg-green-50 transition-all duration-200 border border-green-100 hover:scale-110 z-10" 
            title="Edit Profile" 
            onClick={onEdit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col justify-center mt-16 md:mt-0 md:ml-32">
      <div className="bg-gradient-to-r from-green-50 to-green-100/80 px-3.5 py-1 rounded-full text-xs 
        text-green-700 font-semibold mb-1.5 w-fit flex items-center gap-1.5 shadow-sm border border-green-200/70">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        {vendor.businessType || 'Local Business'}
      </div>
      
      <h1 className="text-3xl font-bold text-green-800 mb-2.5 tracking-tight">{vendor.shopName}</h1>
      
      <div className="flex items-center gap-2.5 text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1.5 
        rounded-lg shadow-sm border border-green-100/50 w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium">{vendor.location || 'Location not set'}</span>
      </div>
      
      <div className="flex gap-3 mt-4">
        <div className="bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-green-100/50 text-sm flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{vendor.shopContact || 'No contact'}</span>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-green-100/50 text-sm flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{vendor.shopMail || 'No email'}</span>
        </div>
      </div>
    </div>
  </div>
);

export default VendorProfileHeader;
