import React from 'react';


const getImageUrl = (url, fallback) => {
  if (!url) return fallback;
  return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const VendorProfileHeader = ({ vendor, onEdit }) => (
  <div className="flex items-center gap-6 mb-8">
    <div className="relative">
      <img src={getImageUrl(vendor.profileBanner, '/default-banner.jpg')} alt="Banner" className="w-[400px] h-32 object-cover rounded-lg" />
      <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow" title="Edit Banner" onClick={onEdit}>
        <span className="material-icons">edit</span>
      </button>
      <div className="absolute left-6 top-16">
        <img src={getImageUrl(vendor.files?.logoUrl, '/default-profile.png')} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white object-cover" />
        <button className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow" title="Edit Profile" onClick={onEdit}>
          <span className="material-icons">edit</span>
        </button>
      </div>
    </div>
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
    </div>
  </div>
);

export default VendorProfileHeader;
