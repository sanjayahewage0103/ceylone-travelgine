import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Vite public assets are referenced from the root
const logo = '/vite.svg';

const getUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return { role: null, name: null };
    
    const roleLabel = user.role === 'vendor' 
      ? 'Travelgine for Vendor' 
      : user.role === 'guide' 
        ? 'Travelgine for Guides' 
        : null;
    
    return { 
      role: roleLabel, 
      name: user.name || user.businessName || user.fullName || user.email 
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return { role: null, name: null };
  }
};

const BusinessNavbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ role: null, name: null });
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <nav className="w-full flex items-center justify-between bg-gradient-to-r from-white via-white to-green-50 shadow-md px-6 py-3 z-50 sticky top-0 border-b border-green-100">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-lg p-0.5 transition-all duration-300 transform group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-300 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <img src={logo} alt="Ceylone Travelgine Logo" className="h-10 w-10 relative z-10 bg-white rounded p-1" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-none">Ceylone Travelgine</h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-300"></div>
          </div>
        </Link>
        {userInfo.role && (
          <div className="hidden md:block ml-6 px-4 py-1.5 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-white shadow-sm">
            <span className="text-sm font-medium text-green-700">{userInfo.role}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {userInfo.name && (
          <div className="hidden md:flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-sm border border-green-100">
            <div className="h-7 w-7 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold border border-green-200">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium">{userInfo.name}</span>
          </div>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="md:hidden h-9 w-9 bg-white rounded-full flex items-center justify-center shadow border border-green-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-100 z-50 py-1">
              {userInfo.role && (
                <div className="px-4 py-2 border-b border-green-100">
                  <div className="text-xs text-gray-500">Account Type</div>
                  <div className="text-sm font-medium">{userInfo.role}</div>
                </div>
              )}
              {userInfo.name && (
                <div className="px-4 py-2 border-b border-green-100">
                  <div className="text-xs text-gray-500">User</div>
                  <div className="text-sm font-medium">{userInfo.name}</div>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout} 
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow hover:shadow-md"
        >
          <span className="font-medium">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default BusinessNavbar;
