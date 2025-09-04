import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
const logo = '/marketplace-logo.png'; // Use public asset URL

const MarketplaceNavbar = ({ search, setSearch, onSearch }) => (
  <nav className="bg-white shadow flex items-center justify-between px-4 py-2 border-b border-gray-200">
    {/* Left: Marketplace Logo */}
    <div className="flex items-center gap-2">
      <img src={logo} alt="Marketplace Logo" className="h-8 w-8" />
      <span className="font-bold text-lg text-green-700">Marketplace</span>
    </div>
    {/* Center: Nav Links and Search Bar */}
    <div className="flex gap-6 items-center">
      <Link to="/marketplace" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
      <Link to="/marketplace/products" className="text-gray-700 hover:text-green-700 font-medium">Products</Link>
      <Link to="/marketplace/shops" className="text-gray-700 hover:text-green-700 font-medium">Shops</Link>
      {/* Search Bar */}
      <form
        onSubmit={e => { e.preventDefault(); onSearch && onSearch(); }}
        className="ml-4 flex items-center bg-gray-100 rounded px-2"
      >
        <input
          type="text"
          placeholder="Search products, categories, keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent outline-none px-2 py-1 text-sm"
        />
        <button type="submit" className="text-green-700 font-bold px-2">Search</button>
      </form>
    </div>
    {/* Right: Cart Icon */}
    <div>
      <CartIcon />
    </div>
  </nav>
);

export default MarketplaceNavbar;
