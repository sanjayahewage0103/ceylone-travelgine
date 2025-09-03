import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa';
import logo from '/public/vite.svg'; // Replace with your actual logo path

const MainNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Logo and Title */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80">
          <img src={logo} alt="Ceylone Travelgine Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-blue-700">Ceylone Travelgine</span>
        </Link>
        {/* Center: Nav Links (hidden on mobile) */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/explore-lanka" className="text-gray-700 hover:text-blue-700 font-medium">Explore Lanka</Link>
          <Link to="/marketplace" className="text-gray-700 hover:text-blue-700 font-medium">Ceylone Marketplace</Link>
        </div>
        {/* Right: Notification, Dropdown, Menu Icon */}
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-blue-700">
            <FaBell size={20} />
            {/* Notification dot (optional) */}
            {/* <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span> */}
          </button>
          {/* Dropdown for Login/Register */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-700 hover:text-blue-700 font-medium focus:outline-none"
            >
              Login / Register
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-30">
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</Link>
                <div className="border-t my-1"></div>
                <Link to="/tourist/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tourist Login</Link>
                <Link to="/tourist/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tourist Register</Link>
              </div>
            )}
          </div>
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars size={22} />
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <Link to="/explore-lanka" className="block py-2 text-gray-700 hover:text-blue-700">Explore Lanka</Link>
          <Link to="/marketplace" className="block py-2 text-gray-700 hover:text-blue-700">Ceylone Marketplace</Link>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="block w-full text-left py-2 text-gray-700 hover:text-blue-700"
          >
            Login / Register
          </button>
          {dropdownOpen && (
            <div className="pl-4">
              <Link to="/login" className="block py-1 text-gray-700 hover:text-blue-700">Login</Link>
              <Link to="/register" className="block py-1 text-gray-700 hover:text-blue-700">Register</Link>
              <Link to="/tourist/login" className="block py-1 text-gray-700 hover:text-blue-700">Tourist Login</Link>
              <Link to="/tourist/register" className="block py-1 text-gray-700 hover:text-blue-700">Tourist Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
