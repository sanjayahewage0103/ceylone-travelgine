import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  FaBars, 
  FaBell, 
  FaSearch, 
  FaShoppingCart, 
  FaAngleDown, 
  FaSuitcase 
} from 'react-icons/fa';
import { 
  RiDashboardLine, 
  RiHeartLine, 
  RiRoadMapLine, 
  RiRobot2Line, 
  RiThumbUpLine,
  RiFileListLine, 
  RiCalendarLine, 
  RiUser3Line, 
  RiBellLine, 
  RiSettings3Line,
  RiGroupLine,
  RiVipDiamondLine
} from 'react-icons/ri';
import * as framerMotion from 'framer-motion';
const { motion, AnimatePresence } = framerMotion;

const MainNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTourist, setIsTourist] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && window.innerWidth < 1024) {
        setIsSearchExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePic: '',
    memberSince: '',
    role: ''
  });
  
  // Check login state (tourist) and fetch user data
  useEffect(() => {
    // Check for tourist session: token and no guide/vendor/admin role
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const isGuide = !!localStorage.getItem('guideId');
    const isVendor = !!localStorage.getItem('vendorId');
    const isTouristUser = !!token && !isGuide && !isVendor;
    
    setIsTourist(isTouristUser);
    
    if (isTouristUser && userId) {
      // Try to get user data from localStorage first for immediate display
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        try {
          const parsed = JSON.parse(cachedUserData);
          setUserData(parsed);
        } catch (e) {
          console.error("Failed to parse cached user data");
        }
      }
      
      // Then fetch fresh data from API
      const fetchUserData = async () => {
        try {
          // Fetch from API endpoint
          const response = await fetch(`/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const userData = {
              name: data.fullName || data.name || 'Ceylon Tourist',
              email: data.email || '',
              profilePic: data.profilePic || '',
              memberSince: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              }) : 'Sep 2023',
              role: data.role || 'tourist'
            };
            
            setUserData(userData);
            // Cache for future use
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      };
      
      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    // Remove tourist session/token
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsTourist(false);
    setSidebarOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/tours?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setIsSearchExpanded(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-teal-50 to-blue-50 backdrop-blur-sm sticky top-0 w-full z-50 border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Left: Logo and Title */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/Ceylon.svg" alt="Ceylon Travelgine" className="h-10 w-auto group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Ceylon Travelgine
            </span>
            <span className="text-xs text-gray-500 -mt-1">Discover the Pearl of the Indian Ocean</span>
          </div>
        </Link>
        
        {/* Center: Nav Links (hidden on mobile) */}
        <div className="hidden lg:flex items-center">
          <div className="flex gap-1">
            {/* Navigation Links with hover effect */}
            <NavLink to="/" label="Explore Lanka" />
            <NavLink to="/tours" label="Tours" />
            <NavLink to="/marketplace" label="Marketplace" />
            <NavLink to="/blogs" label="Blogs" />
            <div className="relative group">
              <button className="px-4 py-2 rounded-md flex items-center gap-1 text-gray-700 hover:text-teal-600 font-medium transition-colors">
                More
                <FaAngleDown className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] border border-blue-100 z-50">
                <Link to="/smart-itinerary" className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-600">
                  Smart Itinerary
                </Link>
                <Link to="/ceylon-lence" className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-600">
                  Ceylon Lence
                </Link>
                <Link to="/business-intro" className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:text-teal-600">
                  For Businesses
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Search, Notifications, Cart, User */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search bar */}
          <div 
            ref={searchRef} 
            className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-10 md:w-64'}`}
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isSearchExpanded ? '' : 'md:pointer-events-auto md:cursor-pointer'}`}
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}>
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full bg-white border border-blue-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all ${
                  isSearchExpanded ? 'opacity-100 scale-100' : 'md:opacity-100 opacity-0 scale-0 md:scale-100'
                }`}
              />
            </form>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
            <FaBell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full transform -translate-y-1 translate-x-1">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Shopping Cart */}
          <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
            <FaShoppingCart size={20} />
            <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-teal-500 text-white text-xs font-bold rounded-full transform -translate-y-1 translate-x-1">
              2
            </span>
          </Link>
          
          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (isTourist) setSidebarOpen(!sidebarOpen);
                else setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-teal-50 transition-colors"
              aria-label="User menu"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold overflow-hidden">
                {isTourist ? (
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "G"
                )}
              </div>
              <FaAngleDown className={`text-gray-500 transition-transform duration-300 ${dropdownOpen || sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* User dropdown menu */}
            <AnimatePresence>
              {!isTourist && dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-30 border border-blue-100 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-100">
                    <h3 className="text-sm font-semibold text-gray-600">Welcome to Ceylon Travelgine</h3>
                    <p className="text-xs text-gray-500">Sign in to access personalized features</p>
                  </div>
                  
                  <div className="p-2">
                    <Link to="/tourist" className="flex items-center gap-3 p-3 rounded-md hover:bg-teal-50 transition-colors">
                      <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Tourist</p>
                        <p className="text-xs text-gray-500">Explore and book tours</p>
                      </div>
                    </Link>
                    
                    <Link to="/guide" className="flex items-center gap-3 p-3 rounded-md hover:bg-teal-50 transition-colors">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Guide</p>
                        <p className="text-xs text-gray-500">Offer your guiding services</p>
                      </div>
                    </Link>
                    
                    <Link to="/vendor" className="flex items-center gap-3 p-3 rounded-md hover:bg-teal-50 transition-colors">
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Vendor</p>
                        <p className="text-xs text-gray-500">Sell products on marketplace</p>
                      </div>
                    </Link>
                    
                    <div className="p-2 mt-2 border-t border-blue-100 flex justify-between">
                      <Link to="/business-intro" className="text-xs text-blue-600 hover:text-blue-800">Business Solutions</Link>
                      <Link to="/admin/login" className="text-xs text-gray-500 hover:text-gray-700">Admin</Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Tourist sidebar */}
            <AnimatePresence>
              {isTourist && sidebarOpen && (
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 flex flex-col border-l border-blue-100"
                >
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-800">
                        {new Date().getHours() < 12 
                          ? "Good Morning" 
                          : new Date().getHours() < 18 
                            ? "Good Afternoon" 
                            : "Good Evening"
                        }
                      </h3>
                      <button 
                        className="p-2 rounded-full hover:bg-white/50 text-gray-500 transition-colors" 
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      {userData.profilePic ? (
                        <div className="relative">
                          <img 
                            src={userData.profilePic} 
                            alt={userData.name} 
                            className="h-16 w-16 rounded-full border-4 border-white shadow-sm object-cover"
                          />
                          {userData.role === 'premium_tourist' && (
                            <div className="absolute -right-1 -bottom-1 bg-yellow-500 text-white rounded-full p-1 border-2 border-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full border-4 border-white shadow-sm bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold relative">
                          {userData.name.charAt(0)}
                          {userData.role === 'premium_tourist' && (
                            <div className="absolute -right-1 -bottom-1 bg-yellow-500 text-white rounded-full p-1 border-2 border-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{userData.name}</p>
                        <div className="flex items-center gap-2">
                          {userData.role === 'premium_tourist' ? (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full font-medium">
                              Premium
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs rounded-full font-medium">
                              Tourist
                            </span>
                          )}
                          <p className="text-xs text-gray-600">Member since {userData.memberSince}</p>
                        </div>
                        {userData.role === 'premium_tourist' ? (
                          <div className="mt-1 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <p className="text-xs text-green-600">Premium Benefits Active</p>
                          </div>
                        ) : (
                          <Link to="/tourist/upgrade" className="text-xs text-blue-600 mt-1 hover:underline">
                            Upgrade to Premium →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 px-3 mb-2">MY DASHBOARD</p>
                      <SidebarLink 
                        to="/tourist/dashboard" 
                        label="My Dashboard" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-6 mb-2">MY TRIPS</p>
                      <SidebarLink 
                        to="/tourist/my-tours" 
                        label="My Booked Tours" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/trip-history" 
                        label="Trip History" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <SidebarLink 
                        to="/tourist/plan-trip" 
                        label="Plan a Trip with AI" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/smart-itinerary" 
                        label="Smart Itinerary Planner" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/saved-places" 
                        label="Saved Places" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      
                      <p className="text-xs font-semibold text-gray-500 px-3 mt-6 mb-2">SHOPPING</p>
                      <SidebarLink 
                        to="/cart" 
                        label="My Cart" 
                        badge="2"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/my-orders" 
                        label="Order History" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/wishlist" 
                        label="My Wishlist" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      
                      <p className="text-xs font-semibold text-gray-500 px-3 mt-6 mb-2">LOYALTY & REWARDS</p>
                      <SidebarLink 
                        to="/tourist/loyalty-rewards" 
                        label="My Rewards" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        }
                        badge={userData?.role === 'premium_tourist' ? 'Gold' : 'Silver'}
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <SidebarLink 
                        to="/tourist/referrals" 
                        label="Refer Friends" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      
                      <p className="text-xs font-semibold text-gray-500 px-3 mt-6 mb-2">RECENTLY VIEWED</p>
                      <div className="bg-blue-50 rounded-lg p-2 mx-2 mb-4">
                        <p className="text-xs text-gray-600 mb-2">You recently viewed:</p>
                        <div className="space-y-2">
                          <Link 
                            to="/tours/kandy-heritage"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-md bg-blue-100 flex-shrink-0 overflow-hidden">
                              <img 
                                src="/assets/tours/kandy-thumbnail.jpg" 
                                alt="Kandy Heritage Tour"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/32x32?text=KH";
                                }}
                              />
                            </div>
                            <span className="truncate">Kandy Heritage Tour</span>
                          </Link>
                          <Link 
                            to="/marketplace/products/ceylon-tea-collection"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-md bg-green-100 flex-shrink-0 overflow-hidden">
                              <img 
                                src="/assets/products/tea-collection.jpg" 
                                alt="Ceylon Tea Collection"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/32x32?text=TC";
                                }}
                              />
                            </div>
                            <span className="truncate">Ceylon Tea Collection</span>
                          </Link>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-6 mb-2">ACCOUNT</p>
                      <SidebarLink 
                        to="/tourist/profile" 
                        label="My Profile" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <SidebarLink 
                        to="/ceylon-lence" 
                        label="Ceylon Lence" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/settings" 
                        label="Account Settings" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/notifications" 
                        label="Notifications" 
                        badge={notificationCount > 0 ? notificationCount.toString() : null}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <SidebarLink 
                        to="/tourist/travel-companions" 
                        label="Travel Companions" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <div className="px-3 py-4 mt-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg mx-2">
                        <h3 className="font-semibold text-sm text-gray-800 mb-3">Recommended for you</h3>
                        <div className="space-y-2">
                          <Link 
                            to="/tours/sigiriya-day-trip"
                            className="block bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src="/assets/tours/sigiriya.jpg"
                                  alt="Sigiriya Day Trip"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/48x48?text=SD";
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Sigiriya Day Trip</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-xs bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                                    Trending
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    4.9 ★
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <Link 
                            to="/ai-trip-planner"
                            className="block bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-teal-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-teal-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Create AI Trip Plan</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                    New Feature
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      <div className="px-2 py-4">
                        <button 
                          className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                          onClick={handleLogout}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-3-3V4a1 1 0 00-1-1H3zm9 2.414L14.586 8H12V5.414zm-5 .172a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3.5a.5.5 0 00-1 0V15H7V8.5h2a.5.5 0 000-1H7.172z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10.36 18.85a1 1 0 001.28-1.54l-2.5-2.5a1 1 0 10-1.414 1.414l2.5 2.5c.403.404.961.614 1.53.395z" clipRule="evenodd" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Hamburger menu for mobile */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars size={22} />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-blue-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <Link to="/" 
                className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Explore Lanka
              </Link>
              <Link to="/tours" 
                className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Tours
              </Link>
              <Link to="/marketplace" 
                className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Ceylone Marketplace
              </Link>
              <Link to="/blogs" 
                className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link to="/smart-itinerary" 
                className="block p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Smart Itinerary Planner
              </Link>
              
              <div className="border-t border-blue-100 my-2 pt-2">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between w-full p-3 rounded-md hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 text-gray-700"
                >
                  <span>Login / Register</span>
                  <FaAngleDown className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="ml-3 border-l-2 border-teal-100 pl-4 mt-1 space-y-2">
                    <Link to="/tourist" 
                      className="block py-2 text-teal-600 font-medium"
                      onClick={() => {
                        setMenuOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      Tourist Account
                    </Link>
                    <Link to="/guide" 
                      className="block py-2 text-blue-600 font-medium"
                      onClick={() => {
                        setMenuOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      Guide Account
                    </Link>
                    <Link to="/vendor" 
                      className="block py-2 text-amber-600 font-medium"
                      onClick={() => {
                        setMenuOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      Vendor Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper Components
const NavLink = ({ to, label }) => (
  <Link 
    to={to} 
    className="relative px-4 py-2 rounded-md text-gray-700 hover:text-teal-600 font-medium group transition-colors"
  >
    {label}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-teal-500 w-0 group-hover:w-3/4 transition-all duration-300"></span>
  </Link>
);

const SidebarLink = ({ to, label, icon, badge, onClick, isNew }) => (
  <Link 
    to={to}
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors relative"
    onClick={onClick}
  >
    <div className="text-gray-500">{icon}</div>
    <span className="font-medium">{label}</span>
    {badge && (
      <span className="ml-auto bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
    {isNew && (
      <span className="absolute right-0 top-0 transform -translate-y-1/2 translate-x-1/4 bg-blue-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
        NEW
      </span>
    )}
  </Link>
);

export default MainNavbar;

