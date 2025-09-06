import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
// Direct imports from framer-motion for clarity
import { motion, AnimatePresence } from 'framer-motion';

const MainNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTourist, setIsTourist] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  
  // Track sidebarOpen state changes
  useEffect(() => {
    console.log("Sidebar state changed:", sidebarOpen);
  }, [sidebarOpen]);
  
  // Debug: Monitor the auth state and sidebar state
  useEffect(() => {
    // Check token and tourist status every second to see why sidebar isn't showing
    const debugInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      console.log("Debug check - Token:", !!token, "isTourist:", isTourist, "sidebarOpen:", sidebarOpen);
      
      if (token && !sidebarOpen) {
        console.log("Debug fix - Tourist with token but sidebar closed. Opening sidebar...");
        setSidebarOpen(true);
      }
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(debugInterval);
  }, [isTourist, sidebarOpen]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
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
    const checkAuthState = () => {
      // Check for tourist session: token and no guide/vendor/admin role
      const token = localStorage.getItem('token');
      let userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const isGuide = !!localStorage.getItem('guideId');
      const isVendor = !!localStorage.getItem('vendorId');
      
      // If we have a token but no userId, try to extract it from the token
      if (token && !userId) {
        try {
          // Decode the JWT token to get the userId
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.id) {
              userId = payload.id;
              // Store userId in localStorage for future use
              localStorage.setItem('userId', userId);
              console.log("Extracted userId from token:", userId);
            }
          }
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }
      
      // User is a tourist if they have a token AND either:
      // 1. They have a userRole that includes 'tourist') OR
      // 2. They don't have guide/vendor IDs (default to tourist)
      // Force isTouristUser to true if we have a token, regardless of other factors
      const isTouristUser = !!token;
      
      console.log("Tourist check:", { isTouristUser, token, userId, userRole, path: location.pathname });
      setIsTourist(isTouristUser);
      
      if (isTouristUser) {
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
        
        // Then fetch fresh data from API if we have a userId
        if (userId) {
          const fetchUserData = async () => {
            try {
              // Fetch from API endpoint
              console.log("Fetching user data for userId:", userId);
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
      }
    };
    
    // Check auth state immediately and also set up an event listener for storage changes
    checkAuthState();

    // Add an event listener to detect auth changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userId' || e.key === 'userRole') {
        checkAuthState();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // Re-run when location changes

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
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 w-full z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Logo and Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/Ceylon.svg" alt="Ceylon Travelgine" className="h-11 w-auto group-hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
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
            {/* Navigation Links with modern hover effect */}
            <NavLink to="/" label="Explore Lanka" />
            <NavLink to="/tours" label="Tours" />
            <NavLink to="/marketplace" label="Marketplace" />
            <NavLink to="/blogs" label="Blogs" />
            <div className="relative group">
              <button className="px-4 py-2 rounded-md flex items-center gap-1 text-gray-700 group-hover:text-teal-600 font-medium transition-colors">
                More
                <FaAngleDown className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-0 mt-1 bg-white rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[220px] border border-gray-100 z-50 transform origin-top scale-95 group-hover:scale-100">
                <div className="p-2">
                  <Link to="/smart-itinerary" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-blue-50/50 hover:text-teal-600">
                    <RiRoadMapLine className="text-teal-500" />
                    <div>
                      <div className="font-medium">Smart Itinerary</div>
                      <div className="text-xs text-gray-500">AI-powered trip planner</div>
                    </div>
                  </Link>
                  <Link to="/ceylon-lence" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-blue-50/50 hover:text-teal-600">
                    <RiVipDiamondLine className="text-blue-500" />
                    <div>
                      <div className="font-medium">Ceylon Lence</div>
                      <div className="text-xs text-gray-500">Premium experiences</div>
                    </div>
                  </Link>
                  <Link to="/business-intro" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-blue-50/50 hover:text-teal-600">
                    <RiGroupLine className="text-amber-500" />
                    <div>
                      <div className="font-medium">For Businesses</div>
                      <div className="text-xs text-gray-500">Partner with us</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Search, Notifications, Cart, User */}
        <div className="flex items-center gap-2 md:gap-3">
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
                className={`w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all shadow-sm ${
                  isSearchExpanded ? 'opacity-100 scale-100' : 'md:opacity-100 opacity-0 scale-0 md:scale-100'
                }`}
              />
            </form>
          </div>
          
          {/* Action buttons with modern styling */}
          <div className="flex items-center gap-1 md:gap-2 bg-gray-100/70 backdrop-blur-sm rounded-full p-1 border border-gray-200/50 shadow-sm">
            {/* Notifications */}
            <button className="relative p-2 rounded-full text-gray-600 hover:bg-white hover:text-teal-600 transition-all hover:shadow-sm">
              <FaBell size={18} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full transform -translate-y-1 translate-x-1 ring-2 ring-white">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* Shopping Cart */}
            <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-white hover:text-teal-600 transition-all hover:shadow-sm">
              <FaShoppingCart size={18} />
              <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center bg-teal-500 text-white text-[10px] font-bold rounded-full transform -translate-y-1 translate-x-1 ring-2 ring-white">
                2
              </span>
            </Link>
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                console.log("Profile button clicked. isTourist:", isTourist, "Current sidebar state:", sidebarOpen);
                console.log("User data:", userData);
                console.log("Token exists:", !!localStorage.getItem('token'));
                
                // FORCE sidebar open regardless of tourist status (temporary debug fix)
                if (localStorage.getItem('token')) {
                  console.log("Token exists, forcing sidebar open directly");
                  // Force isTourist to true if not already
                  if (!isTourist) {
                    console.log("Setting isTourist to true");
                    setIsTourist(true);
                  }
                  
                  // Always open the sidebar
                  console.log("Setting sidebarOpen to TRUE");
                  setSidebarOpen(true);
                  
                  // Force close the other dropdown
                  setDropdownOpen(false);
                } else {
                  console.log("No token, opening regular dropdown");
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              className="flex items-center gap-2 px-1 py-1 pl-1 pr-2 rounded-full bg-white shadow-sm border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-white">
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
              {console.log("Sidebar render condition:", { isTourist, sidebarOpen, shouldRender: isTourist && sidebarOpen })}
              {(isTourist && sidebarOpen) && (
                <motion.div 
                  key="tourist-sidebar"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                  className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-40 flex flex-col border-l border-gray-100 overflow-hidden"
                  style={{ opacity: 1, zIndex: 9999 }} // Force visibility with high z-index
                >
                  <div className="p-6 bg-gradient-to-r from-blue-50/80 to-teal-50/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        {new Date().getHours() < 12 
                          ? "Good Morning" 
                          : new Date().getHours() < 18 
                            ? "Good Afternoon" 
                            : "Good Evening"
                        }
                      </h3>
                      <button 
                        className="p-2 rounded-full hover:bg-white/80 text-gray-500 hover:text-gray-700 transition-all hover:shadow-sm" 
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 p-3 bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-gray-100">
                      {userData.profilePic ? (
                        <div className="relative">
                          <img 
                            src={userData.profilePic} 
                            alt={userData.name} 
                            className="h-16 w-16 rounded-full border-4 border-white shadow-md object-cover ring-2 ring-teal-100"
                          />
                          {userData.role === 'premium_tourist' && (
                            <div className="absolute -right-1 -bottom-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full p-1 border-2 border-white shadow-lg">
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
                        <div className="flex items-center gap-2 mt-1">
                          {userData.role === 'premium_tourist' ? (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full font-medium shadow-sm">
                              Premium
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs rounded-full font-medium shadow-sm">
                              Tourist
                            </span>
                          )}
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Member since {userData.memberSince}
                          </p>
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
                  
                  <div className="p-4 flex-1 overflow-y-auto" style={{ minHeight: "200px", height: "300px", overflowY: "auto" }}>
                    {/* Quick Actions - Top bar with most used functions */}
                    <div className="grid grid-cols-4 gap-2 bg-gradient-to-r from-blue-50/70 to-teal-50/70 backdrop-blur-sm p-3 rounded-xl mb-4 shadow-sm border border-blue-50">
                      <Link to="/tourist/dashboard" 
                        className="flex flex-col items-center p-2 hover:bg-white/80 rounded-lg transition-colors hover:shadow-sm"
                        onClick={() => setSidebarOpen(false)}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg text-white mb-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Dashboard</span>
                      </Link>
                      <Link to="/tourist/my-tours" 
                        className="flex flex-col items-center p-2 hover:bg-white/80 rounded-lg transition-colors hover:shadow-sm"
                        onClick={() => setSidebarOpen(false)}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white mb-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">My Tours</span>
                      </Link>
                      <Link to="/tourist/plan-trip" 
                        className="flex flex-col items-center p-2 hover:bg-white/80 rounded-lg transition-colors hover:shadow-sm"
                        onClick={() => setSidebarOpen(false)}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white mb-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Plan Trip</span>
                      </Link>
                      <Link to="/cart" 
                        className="flex flex-col items-center p-2 hover:bg-white/80 rounded-lg transition-colors hover:shadow-sm"
                        onClick={() => setSidebarOpen(false)}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white mb-1 shadow-sm relative">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-1 ring-white">2</span>
                        </div>
                        <span className="text-xs font-medium">Cart</span>
                      </Link>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 px-3 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        MY DASHBOARD
                      </p>
                      <SidebarLink 
                        to="/tourist/dashboard" 
                        label="My Dashboard" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-5 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        MY TRIPS
                      </p>
                      <SidebarLink 
                        to="/tourist/my-tours" 
                        label="Upcoming Tours" 
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
                        label="Past Trips" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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
                      />

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-5 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        SHOPPING
                      </p>
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
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />
                      <SidebarLink 
                        to="/tourist/wishlist" 
                        label="Wishlist" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-5 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        TRIP PLANNING
                      </p>
                      <SidebarLink 
                        to="/tourist/plan-trip" 
                        label="Create Trip with AI" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      <SidebarLink 
                        to="/smart-itinerary" 
                        label="Smart Itinerary" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                        isNew={true}
                      />
                      
                      {/* Rewards section with visual badge */}
                      <div className="px-3 py-3 mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg mx-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            My Rewards
                          </h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full 
                            ${userData?.role === 'premium_tourist' ? 
                              'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : 
                              'bg-gradient-to-r from-gray-300 to-gray-400 text-white'}`}>
                            {userData?.role === 'premium_tourist' ? 'GOLD' : 'SILVER'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 mb-1">
                          <Link to="/tourist/loyalty-rewards" 
                            className="flex-1 bg-white p-2 rounded-md shadow-sm hover:shadow transition-shadow text-center text-xs font-medium"
                            onClick={() => setSidebarOpen(false)}>
                            View Points
                          </Link>
                          <Link to="/tourist/referrals" 
                            className="flex-1 bg-white p-2 rounded-md shadow-sm hover:shadow transition-shadow text-center text-xs font-medium"
                            onClick={() => setSidebarOpen(false)}>
                            Refer Friends
                          </Link>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-gray-500 px-3 mt-5 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        MY ACCOUNT
                      </p>
                      <SidebarLink 
                        to="/tourist/profile" 
                        label="My Profile" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
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
                        to="/ceylon-lence" 
                        label="Ceylon Lence" 
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => setSidebarOpen(false)}
                      />

                      {/* Trending recommendations - Made more compact */}
                      <p className="text-xs font-semibold text-gray-500 px-3 mt-5 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        DISCOVER
                      </p>
                      <div className="px-2">
                        <Link 
                          to="/tours/sigiriya-day-trip"
                          className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-md bg-blue-100 flex-shrink-0 overflow-hidden">
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
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800">Sigiriya Day Trip</p>
                            <div className="flex items-center">
                              <span className="text-xs bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded mr-2">
                                Trending
                              </span>
                              <span className="text-xs text-amber-500">★★★★★</span>
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="px-2 py-4 mt-2">
                        <button 
                          className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow-md hover:from-red-600 hover:to-red-700"
                          onClick={handleLogout}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-3-3V4a1 1 0 00-1-1H3zm9 2.414L14.586 8H12V5.414zm-5 .172a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3.5a.5.5 0 00-1 0V15H7V8.5h2a.5.5 0 000-1H7.172z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10.36 18.85a1 1 0 001.28-1.54l-2.5-2.5a1 1 0 10-1.414 1.414l2.5 2.5c.403.404.961.614 1.53.395z" clipRule="evenodd" />
                          </svg>
                          Sign Out
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
const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
                  
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 rounded-md font-medium group transition-all ${
        isActive 
          ? 'text-teal-600' 
          : 'text-gray-700 hover:text-teal-600'
      }`}
    >
      <div className="flex flex-col items-center">
        {label}
        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 rounded-full ${
          isActive 
            ? 'w-2/3 opacity-100' 
            : 'w-0 group-hover:w-2/3 opacity-0 group-hover:opacity-100'
        }`}></span>
      </div>
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500"></div>
      )}
    </Link>
  );
};

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

