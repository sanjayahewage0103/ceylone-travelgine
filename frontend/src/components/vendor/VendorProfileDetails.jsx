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
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div><b>Location:</b> {vendor.location}</div>
          <div><b>Business Reg. No:</b> {vendor.businessRegNum}</div>
        </div>
        <div className="mb-2"><b>Address:</b> {vendor.address}</div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div><b>Shop Email:</b> {vendor.shopMail}</div>
          <div><b>Shop Contact:</b> {vendor.shopContact}</div>
        </div>
        <div className="mb-2"><b>Description:</b> <div className="whitespace-pre-line">{vendor.description}</div></div>
      </div>
    );
  }

  return (
    <form className="bg-white rounded shadow p-6 mb-8" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block font-bold mb-1">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-bold mb-1">Business Reg. No</label>
          <input name="businessRegNum" value={vendor.businessRegNum} disabled className="border rounded px-2 py-1 w-full bg-gray-100" />
        </div>
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Address</label>
        <input name="address" value={form.address} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block font-bold mb-1">Shop Email</label>
          <input name="shopMail" value={form.shopMail} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-bold mb-1">Shop Contact</label>
          <input name="shopContact" value={form.shopContact} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" rows={3} />
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Banner Image</label>
        <input type="file" name="profileBanner" accept="image/*" onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Logo Image</label>
        <input type="file" name="logo" accept="image/*" onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </div>
      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default VendorProfileDetails;
