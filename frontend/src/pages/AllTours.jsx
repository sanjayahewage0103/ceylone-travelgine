

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TourPackageCard from '../components/guide/TourPackageCard';
import tourPackageService from '../services/tourPackageService';
import MainNavbar from '../components/common/MainNavbar';

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

  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line
  }, [search, tourType, tourCategory, minPrice, maxPrice, sortBy, sortOrder, district, duration, cityFilter]);

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
      setTours([]);
    }
    setLoading(false);
  }

  function handleSortChange(e) {
    const value = e.target.value;
    if (value === 'price_lkr_asc') {
      setSortBy('price_lkr');
      setSortOrder('asc');
    } else if (value === 'price_lkr_desc') {
      setSortBy('price_lkr');
      setSortOrder('desc');
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  }

  function handleCityCheck(city) {
    setCityFilter(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  }

  // Mock featured/attraction data
  const topAttractions = [
    { name: 'Sigiriya Rock', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Temple of the Tooth', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Galle Fort', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' },
    { name: 'Yala National Park', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ella Nine Arches', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
  ];
  const goldenTours = tours.slice(0, 5);
  const otherTours = tours.slice(5);

  return (
    <>
      <MainNavbar />
      <div className="bg-gray-50 min-h-screen">
      {/* Section Title and Search */}
      <div className="bg-white border-b py-6 px-4 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Ceylone Tours</h1>
          <div className="text-gray-600 mb-2">Find your perfect Sri Lankan adventure</div>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full md:w-72"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-700 text-white px-4 rounded">Search</button>
        </form>
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Explore:</label>
          <select className="border rounded px-2 py-1" value={district} onChange={e => setDistrict(e.target.value)}>
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Top Attractions */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Top Attractions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {topAttractions.map(attr => (
            <div key={attr.name} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col items-center">
              <img src={attr.img} alt={attr.name} className="h-28 w-full object-cover" />
              <div className="p-2 text-center font-medium">{attr.name}</div>
            </div>
          ))}
        </div>

        {/* Golden Tour Packages */}
        <h2 className="text-xl font-semibold mb-3 text-yellow-700">Golden Tour Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {goldenTours.length === 0 ? <div className="col-span-5 text-gray-400">No featured tours yet.</div> : goldenTours.map(pkg => (
            <TourPackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Main Section: Filters and All Tours */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Filter Trips</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Price Range (LKR per person)</label>
            <div className="flex gap-2">
              <input type="number" className="w-1/2 border rounded px-2 py-1" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" placeholder="Min" />
              <input type="number" className="w-1/2 border rounded px-2 py-1" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" placeholder="Max" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Duration</label>
            <select className="w-full border rounded px-2 py-1" value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="">Any</option>
              <option value="half-day">Half Day</option>
              <option value="full-day">Full Day</option>
              <option value="multi-day">Multi Day</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">City</label>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
              {(showAllDistricts ? DISTRICTS : keyCities).map(city => (
                <label key={city} className="flex items-center gap-2">
                  <input type="checkbox" checked={cityFilter.includes(city)} onChange={() => handleCityCheck(city)} />
                  {city}
                </label>
              ))}
              {!showAllDistricts && (
                <button type="button" className="text-blue-600 text-xs mt-1" onClick={() => setShowAllDistricts(true)}>Show all 25</button>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full border rounded px-2 py-1" value={tourCategory} onChange={e => setTourCategory(e.target.value)}>
              {tourCategories.map(cat => <option key={cat} value={cat}>{cat || 'Any'}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border rounded px-2 py-1" value={tourType} onChange={e => setTourType(e.target.value)}>
              {tourTypes.map(type => <option key={type} value={type}>{type || 'Any'}</option>)}
            </select>
          </div>
        </aside>
        {/* All Tours + Sort */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">All Tours</h2>
            <div>
              <label className="mr-2 text-sm font-medium">Sort by:</label>
              <select className="border rounded px-2 py-1" onChange={handleSortChange}>
                <option value="createdAt">Newest</option>
                <option value="price_lkr_asc">Price (Low to High)</option>
                <option value="price_lkr_desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading tours...</div>
          ) : otherTours.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tours found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {otherTours.map(pkg => (
                <TourPackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          )}
        </main>
      </div>
      </div>
    </>
  );
}
