import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import logo from '/public/vite.svg'; // Replace with your actual logo path


const MainNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isTourist, setIsTourist] = useState(false);
  const navigate = useNavigate();

  // Check login state (tourist)
  useEffect(() => {
    // Check for tourist session: token and no guide/vendor/admin role
    const token = localStorage.getItem('token');
    // Optionally, check user role if stored (e.g. localStorage.getItem('role') === 'tourist')
    // For now, assume if token exists and no guide/vendor id, it's a tourist
    const isGuide = !!localStorage.getItem('guideId');
    const isVendor = !!localStorage.getItem('vendorId');
    setIsTourist(!!token && !isGuide && !isVendor);
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
    }
  };

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
          <Link to="/tours" className="text-gray-700 hover:text-blue-700 font-medium">Tours</Link>
          <Link to="/marketplace" className="text-gray-700 hover:text-blue-700 font-medium">Ceylone Marketplace</Link>
          <Link to="/blogs" className="text-gray-700 hover:text-blue-700 font-medium">Blogs</Link>
          {/* Search bar */}
          <form onSubmit={handleSearch} className="ml-4 flex items-center border rounded overflow-hidden bg-gray-100">
            <input
              type="text"
              placeholder="Search tours..."
              className="px-2 py-1 bg-gray-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 160 }}
            />
            <button type="submit" className="px-2 text-blue-700 font-bold">🔍</button>
          </form>
        </div>
        {/* Right: Notification, Dropdown, Menu Icon */}
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-blue-700">
            <FaBell size={20} />
            {/* Notification dot (optional) */}
            {/* <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span> */}
          </button>
          {/* User icon (placeholder) for login/register */}
          <div className="relative">
            <button
              onClick={() => {
                if (isTourist) setSidebarOpen(!sidebarOpen);
                else setDropdownOpen(!dropdownOpen);
              }}
              className="focus:outline-none flex items-center justify-center"
              aria-label="User menu"
            >
              <FaUserCircle size={30} className="text-gray-400 hover:text-blue-700" />
            </button>
            {/* Tourist sidebar */}
            {isTourist && sidebarOpen && (
              <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200 animate-slideIn">
                <button className="self-end m-4 text-gray-500 hover:text-blue-700 text-2xl" onClick={() => setSidebarOpen(false)}>&times;</button>
                <div className="flex flex-col gap-2 px-6 mt-2">
                  <Link to="/tourist/my-tours" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>View My Tours</Link>
                  <Link to="/tourist/plan-trip" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>Plan Trip with AI</Link>
                  <Link to="/tourist/cart" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>View My Cart</Link>
                  <Link to="/tourist/my-orders" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>View My Orders</Link>
                  <Link to="/ceylon-lence" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>Ceylon Lence</Link>
                  <Link to="/tourist/settings" className="py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={()=>setSidebarOpen(false)}>Settings</Link>
                  <button className="py-2 text-red-600 hover:text-white hover:bg-red-500 font-medium rounded transition" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
            {/* Default dropdown for not-logged-in users */}
            {!isTourist && dropdownOpen && (
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
          <Link to="/tours" className="block py-2 text-gray-700 hover:text-blue-700">Tours</Link>
          <Link to="/marketplace" className="block py-2 text-gray-700 hover:text-blue-700">Ceylone Marketplace</Link>
          <Link to="/blogs" className="block py-2 text-gray-700 hover:text-blue-700">Blogs</Link>
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
