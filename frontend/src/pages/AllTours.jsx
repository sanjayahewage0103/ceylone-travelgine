

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TourPackageCard from '../components/guide/TourPackageCard';
import tourPackageService from '../services/tourPackageService';
import MainNavbar from '../components/common/MainNavbar';
import Footer from '../components/common/Footer';

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
];
const tourTypes = ['', 'Adventure', 'Cultural', 'Wildlife', 'Beach', 'Historical', 'Nature', 'City', 'Other'];
const tourCategories = ['', 'Family', 'Couple', 'Solo', 'Group', 'Luxury', 'Budget', 'Eco', 'Other'];
const sortOptions = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price_lkr', label: 'Price (Low to High)', order: 'asc' },
  { value: 'price_lkr', label: 'Price (High to Low)', order: 'desc' },
];
const keyCities = DISTRICTS.slice(0, 5);


export default function AllTours() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get('search') || '';

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [district, setDistrict] = useState('');
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [tourType, setTourType] = useState('');
  const [tourCategory, setTourCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [duration, setDuration] = useState('');
  const [cityFilter, setCityFilter] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('createdAt');
  const [featuredTours, setFeaturedTours] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTours();
    fetchFeaturedTours();
    
    // Set up auto-refresh for featured tours every 2 minutes
    const refreshInterval = setInterval(() => {
      fetchFeaturedTours(true);
    }, 120000); // 2 minutes
    
    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line
  }, [search, tourType, tourCategory, minPrice, maxPrice, sortBy, sortOrder, district, duration, cityFilter]);
  
  // Update sort states when sort option changes
  useEffect(() => {
    if (sortOption === 'price-low') {
      setSortBy('price_lkr');
      setSortOrder('asc');
    } else if (sortOption === 'price-high') {
      setSortBy('price_lkr');
      setSortOrder('desc');
    } else if (sortOption === 'duration-short') {
      setSortBy('duration_days');
      setSortOrder('asc');
    } else if (sortOption === 'duration-long') {
      setSortBy('duration_days');
      setSortOrder('desc');
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  }, [sortOption]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate(`/tours?search=${encodeURIComponent(search)}`);
  }

  async function fetchTours() {
    setLoading(true);
    try {
      const params = {
        search,
        tourType,
        tourCategory,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        district,
        duration,
        city: cityFilter.join(','),
      };
      const res = await tourPackageService.getAllPublicTours(params);
      setTours(res.data);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setTours([]);
    }
    setLoading(false);
  }

  function handleSortChange(e) {
    setSortOption(e.target.value);
  }
  
  async function fetchFeaturedTours(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setFeaturedLoading(true);
    
    try {
      // Use the dedicated function for featured tours
      const res = await tourPackageService.getFeaturedTours();
      setFeaturedTours(res.data.slice(0, 4)); // Ensure we have exactly 4
    } catch (err) {
      console.error("Error fetching featured tours:", err);
      setFeaturedTours([]);
    }
    
    if (isRefresh) {
      setTimeout(() => setRefreshing(false), 500);
    } else {
      setFeaturedLoading(false);
    }
  }
  
  function handleRefreshFeatured() {
    fetchFeaturedTours(true);
  }

  function handleCityCheck(city) {
    setCityFilter(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  }

  // Mock featured/attraction data
const topAttractions = [
  { name: 'Sigiriya Rock', img: '/images/image/sigiriya.jpeg', size: 'large' },
  { name: 'Temple of the Tooth', img: '/images/image/temple%20of%20tooth.jpeg', size: 'medium' },
  { name: 'Galle Fort', img: '/images/image/galle%20fort.jpeg', size: 'small' },
  { name: 'Yala National Park', img: '/images/image/yala.jpeg', size: 'large' },
  { name: 'Ella Nine Arches', img: '/images/image/nine%20arches.jpeg', size: 'medium' },
  { name: 'Mirissa Beach', img: '/images/image/mirissa.jpeg', size: 'small' },
  { name: 'Dambulla Cave Temple', img: '/images/image/dambulla.jpeg', size: 'medium' },
  { name: 'Polonnaruwa Ruins', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80', size: 'small' },
];
  
  // Using the dedicated fetched featured tours instead of slicing from all tours
  const goldenTours = featuredTours;
  const otherTours = tours;
  const filteredTours = otherTours;
  
  // Current slider position for popular destinations
  const [sliderIndex, setSliderIndex] = useState(0);
  
  // Visible destinations in slider (5 at a time)
  const visibleAttractions = topAttractions.slice(sliderIndex, sliderIndex + 5);

  return (
    <>
      <MainNavbar />
      <div className="bg-white min-h-screen">
      {/* Hero Banner with Search */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 py-12 px-4 md:px-12">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1489516408517-0c0a15662682?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Sri Lanka" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Ceylon Tours</h1>
            <p className="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto">
              Explore handpicked experiences across Sri Lanka's most beautiful destinations
            </p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Search destinations, activities or experiences..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <select 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400" 
                value={district} 
                onChange={e => setDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Top Attractions */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Popular Destinations
          </h2>
          <div className="flex items-center mt-2 md:mt-0">
            <button 
              onClick={() => setSliderIndex(Math.max(0, sliderIndex - 1))}
              disabled={sliderIndex === 0}
              className={`mr-2 p-1.5 rounded-full border ${sliderIndex === 0 ? 'text-gray-300 border-gray-200' : 'text-teal-600 border-teal-200 hover:bg-teal-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setSliderIndex(Math.min(topAttractions.length - 5, sliderIndex + 1))}
              disabled={sliderIndex >= topAttractions.length - 5}
              className={`p-1.5 rounded-full border ${sliderIndex >= topAttractions.length - 5 ? 'text-gray-300 border-gray-200' : 'text-teal-600 border-teal-200 hover:bg-teal-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex overflow-x-hidden pb-4 mb-12">
            <div className={`flex transition-transform duration-500 ease-out gap-4 md:gap-6`} style={{ transform: `translateX(0)` }}>
              {visibleAttractions.map((attr, index) => (
                <div 
                  key={attr.name} 
                  className={`flex-shrink-0 group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden
                    ${attr.size === 'large' ? 'w-full sm:w-1/2 md:w-1/3' : attr.size === 'medium' ? 'w-2/3 sm:w-1/3 md:w-1/4' : 'w-1/2 sm:w-1/4 md:w-1/5'}`}
                >
                  <div className={`overflow-hidden ${attr.size === 'large' ? 'h-60' : attr.size === 'medium' ? 'h-52' : 'h-44'}`}>
                    <img 
                      src={attr.img} 
                      alt={attr.name} 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-3 text-center font-medium bg-gradient-to-r from-teal-50/50 to-blue-50/50">
                    {attr.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 flex justify-center gap-1.5">
            {Array.from({ length: Math.ceil(topAttractions.length / 5) }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setSliderIndex(i * 5)}
                className={`w-2 h-2 rounded-full transition-all ${sliderIndex === i * 5 ? 'bg-teal-600 w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Golden Tour Packages */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-amber-600 mr-2">
              Featured Tour Packages
            </h2>
            <button 
              onClick={handleRefreshFeatured}
              disabled={refreshing}
              className="text-amber-500 hover:text-amber-600 transition-all"
              title="Refresh featured tours"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <a href="#all-tours" className="text-amber-600 hover:text-amber-700 font-medium flex items-center mt-2 md:mt-0">
            See All Packages
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14">
          {featuredLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border animate-pulse aspect-square">
                <div className="h-[65%] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : goldenTours.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">No featured tours available at the moment</p>
              <p className="text-sm mt-2">Please check back soon for exciting new offerings!</p>
              <button 
                onClick={handleRefreshFeatured}
                className="mt-4 text-white bg-amber-500 hover:bg-amber-600 font-medium px-6 py-2 rounded-lg flex items-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          ) : (
            goldenTours.map(pkg => (
              <div key={pkg._id} className="transform transition duration-300 hover:scale-[1.02] hover:z-10">
                <TourPackageCard pkg={pkg} featured={true} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Section: Filters and All Tours */}
      <div className="max-w-7xl mx-auto px-4 py-12" id="all-tours">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Explore All Tours</h2>
          
          {/* Mobile filter button - only visible on mobile */}
          <button 
            className="md:hidden flex items-center justify-center text-teal-600 border border-teal-600 rounded-lg px-4 py-2 mt-3 w-full"
            onClick={() => setShowAllDistricts(!showAllDistricts)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showAllDistricts ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <aside className={`w-full md:w-72 lg:w-80 order-2 md:order-1 ${showAllDistricts ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Filter Results</h3>
                <span className="text-sm text-gray-500">{tours.length} tours</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range (LKR)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₨</span>
                      </div>
                      <input 
                        type="number"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        min="0"
                        placeholder="Min"
                        className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₨</span>
                      </div>
                      <input 
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        min="0"
                        placeholder="Max"
                        className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Any', 'Half Day', 'Full Day', 'Multi Day'].map((option, idx) => {
                      const value = idx === 0 ? '' : option.toLowerCase().replace(' ', '-');
                      return (
                        <div 
                          key={option}
                          onClick={() => setDuration(value)}
                          className={`px-3 py-2 rounded-md text-center cursor-pointer text-sm border transition-all ${
                            duration === value 
                              ? 'bg-teal-50 border-teal-500 text-teal-700 font-medium' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">District</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 max-h-40 overflow-y-auto pr-1">
                    {(showAllDistricts ? DISTRICTS : keyCities).map(city => (
                      <label key={city} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={cityFilter.includes(city)} 
                          onChange={() => handleCityCheck(city)}
                          className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
                        />
                        <span className="text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                  {!showAllDistricts && (
                    <button 
                      type="button" 
                      className="text-teal-600 hover:text-teal-800 text-sm mt-2 flex items-center"
                      onClick={() => setShowAllDistricts(true)}
                    >
                      Show all districts
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                  <select 
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={tourCategory} 
                    onChange={e => setTourCategory(e.target.value)}
                  >
                    {tourCategories.map(cat => <option key={cat} value={cat}>{cat || 'Any'}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tour Type</label>
                  <select 
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={tourType} 
                    onChange={e => setTourType(e.target.value)}
                  >
                    {tourTypes.map(type => <option key={type} value={type}>{type || 'Any'}</option>)}
                  </select>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setDuration('');
                      setCityFilter([]);
                      setTourType('');
                      setTourCategory('');
                      setSearch('');
                      setDistrict('');
                    }}
                    className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-2.5 px-4 rounded-lg flex items-center justify-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>
          
          {/* All Tours + Sort */}
          <main className="flex-1 order-1 md:order-2">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-3 sm:mb-0">
                  <span className="text-gray-500">{tours.length} tours available</span>
                </div>
                <div className="flex items-center">
                  <label className="text-sm text-gray-500 mr-2">Sort by:</label>
                  <select 
                    className="border border-gray-300 rounded-md text-gray-700 py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    onChange={handleSortChange}
                  >
                    <option value="createdAt">Newest</option>
                    <option value="price_lkr_asc">Price (Low to High)</option>
                    <option value="price_lkr_desc">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : otherTours.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No tours match your search</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search for something else</p>
                <button 
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setDuration('');
                    setCityFilter([]);
                    setTourType('');
                    setTourCategory('');
                    setSearch('');
                    setDistrict('');
                  }}
                  className="text-teal-600 hover:text-teal-800 font-medium flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {otherTours.map(pkg => (
                  <TourPackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            )}
            
            {/* Pagination - shown when there are many tours */}
            {otherTours.length > 12 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="px-2 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-4 py-2 rounded-md bg-teal-50 text-teal-600 font-medium hover:bg-teal-100">1</button>
                  <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">2</button>
                  <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">3</button>
                  <span className="px-2 py-2 text-gray-500">...</span>
                  <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">8</button>
                  <button className="px-2 py-2 rounded-md text-gray-500 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
