import React from 'react';
import { Link } from 'react-router-dom';
// Vite public assets are referenced from the root
const logo = '/vite.svg';

const getRoleLabel = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null;
  if (user.role === 'vendor') return 'Travelgine for Vendor';
  if (user.role === 'guide') return 'Travelgine for Guides';
  return null;
};

const BusinessNavbar = () => {
  const roleLabel = getRoleLabel();
  return (
    <nav className="w-full flex items-center justify-between bg-white shadow px-6 py-3 z-50">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src={logo} alt="Ceylone Travelgine Logo" className="h-10 w-10" />
        </Link>
        <span className="text-xl font-bold text-gray-800">Ceylone Travelgine</span>
        <span className="italic text-lg text-gray-500 ml-4">Travelgine for Business</span>
      </div>
      {roleLabel && (
        <div className="text-md font-semibold text-blue-700 bg-blue-50 px-4 py-1 rounded">
          {roleLabel}
        </div>
      )}
    </nav>
  );
};

export default BusinessNavbar;
