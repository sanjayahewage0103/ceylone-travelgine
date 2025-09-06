import React, { useState } from 'react';

const VendorProfileDetails = ({ vendor, editMode, onSave, onCancel }) => {
  const [form, setForm] = useState({
    address: vendor.address || '',
    location: vendor.location || '',
    shopContact: vendor.shopContact || '',
    shopMail: vendor.shopMail || '',
    description: vendor.description || '',
    profileBanner: vendor.profileBanner || '',
    logoUrl: vendor.files?.logoUrl || '',
    email: vendor.email || '',
    profileBannerFile: null,
    logoFile: null,
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, [name + 'File']: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Prepare FormData for file upload
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'profileBannerFile' && value) {
        data.append('profileBanner', value);
      } else if (key === 'logoFile' && value) {
        data.append('logo', value);
      } else if (!key.endsWith('File')) {
        data.append(key, value);
      }
    });
    onSave(data);
  };

  if (!editMode) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/75 to-green-50/70 rounded-xl shadow-lg p-6 mb-8 border border-green-200/50">
        {/* Top colored accent */}
        <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100/40 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </div>
            <div className="text-gray-800 group-hover:text-green-800 transition-colors pl-6">
              {vendor.location || "Not specified"}
            </div>
          </div>
          
          <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100/40 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Business Reg. No
            </div>
            <div className="text-gray-800 font-medium group-hover:text-green-800 transition-colors pl-6">
              {vendor.businessRegNum || "Not registered"}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100/40 shadow-sm mb-6 transition-all duration-300 hover:shadow-md group">
          <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Address
          </div>
          <div className="text-gray-800 group-hover:text-green-800 transition-colors pl-6">
            {vendor.address || "No address provided"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100/40 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Shop Email
            </div>
            <a 
              href={`mailto:${vendor.shopMail}`} 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors pl-6"
            >
              {vendor.shopMail || "No email provided"}
            </a>
          </div>
          
          <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-green-100/40 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Shop Contact
            </div>
            <a 
              href={`tel:${vendor.shopContact}`} 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors pl-6"
            >
              {vendor.shopContact || "No contact provided"}
            </a>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-sm text-green-700 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Description
          </div>
          <div className="bg-gradient-to-br from-white/80 to-green-50/60 backdrop-blur-sm p-5 rounded-lg border border-green-100/40 text-gray-700 leading-relaxed shadow-sm">
            {vendor.description ? 
              <p className="whitespace-pre-line">{vendor.description}</p> : 
              <p className="text-gray-500 italic">No description provided</p>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="backdrop-blur-md bg-white/70 rounded-xl shadow-lg p-6 mb-8 border border-green-100" onSubmit={handleSubmit} encType="multipart/form-data">
      <h3 className="text-xl font-semibold text-green-800 mb-4">Edit Business Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              className="border border-green-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90" 
              placeholder="Enter your location"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Business Reg. No</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <input 
              name="businessRegNum" 
              value={vendor.businessRegNum} 
              disabled 
              className="border border-green-200 rounded-lg px-4 py-2 pl-10 w-full bg-gray-100/90" 
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-green-700 mb-2">Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <input 
            name="address" 
            value={form.address} 
            onChange={handleChange} 
            className="border border-green-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90" 
            placeholder="Enter your address"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Shop Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              name="shopMail" 
              value={form.shopMail} 
              onChange={handleChange} 
              className="border border-green-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90" 
              placeholder="Enter shop email"
              type="email"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Shop Contact</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input 
              name="shopContact" 
              value={form.shopContact} 
              onChange={handleChange} 
              className="border border-green-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90" 
              placeholder="Enter shop contact"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          className="border border-green-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90" 
          rows={4} 
          placeholder="Tell customers about your business..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Banner Image</label>
          <div className="relative">
            <input 
              type="file" 
              name="profileBanner" 
              accept="image/*" 
              onChange={handleChange} 
              className="hidden" 
              id="banner-upload"
            />
            <label 
              htmlFor="banner-upload" 
              className="flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 cursor-pointer bg-white/60 hover:bg-green-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-green-700">{form.profileBannerFile ? form.profileBannerFile.name : "Click to upload banner"}</span>
              </div>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">Logo Image</label>
          <div className="relative">
            <input 
              type="file" 
              name="logo" 
              accept="image/*" 
              onChange={handleChange} 
              className="hidden" 
              id="logo-upload"
            />
            <label 
              htmlFor="logo-upload" 
              className="flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 cursor-pointer bg-white/60 hover:bg-green-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700">{form.logoFile ? form.logoFile.name : "Click to upload logo"}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-end">
        <button 
          type="button" 
          className="px-6 py-2.5 rounded-lg border border-green-200 bg-white text-green-700 font-medium hover:bg-green-50 transition-colors shadow-sm" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 text-white font-medium shadow-md transition-all transform hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default VendorProfileDetails;
