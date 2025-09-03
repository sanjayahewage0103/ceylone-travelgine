import React, { useEffect, useState } from 'react';
import MainNavbar from '../../components/common/MainNavbar';
import MarketplaceNavbar from '../../components/marketplace/MarketplaceNavbar';

function ShopCard({ shop }) {
  const [showFull, setShowFull] = useState(false);
  const maxDesc = 100;
  const desc = shop.description || '';
  const isLong = desc.length > maxDesc;
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
      <img
        src={shop.logoUrl || '/shop-logo.png'}
        alt={shop.shopName}
        className="h-20 w-20 object-cover rounded-full mb-2 border"
      />
      <div className="font-bold text-lg text-green-800 mb-1">{shop.shopName}</div>
      <div className="text-gray-500 text-sm mb-1">{shop.location}</div>
      <div className="text-gray-700 text-sm mb-2">
        {showFull || !isLong ? desc : desc.slice(0, maxDesc) + '...'}
        {isLong && (
          <button
            className="text-green-700 ml-1 text-xs underline"
            onClick={() => setShowFull(v => !v)}
          >
            {showFull ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}

const ShopListPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products/shops');
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        // Optionally fetch more vendor details if needed
        setShops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainNavbar />
      <MarketplaceNavbar />
      <div className="w-full h-48 bg-cover bg-center mb-8" style={{ backgroundImage: `url('/marketplace-banner.jpg')` }} />
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-white bg-opacity-90 rounded-lg shadow p-6 text-center">
          <h1 className="text-3xl font-bold mb-2 text-green-800">Explore Our Artisan Shops</h1>
          <p className="text-lg text-gray-700">Discover unique Sri Lankan craftsmanship, local flavors, and authentic experiences from our trusted vendors. Support local artisans and find your next treasure!</p>
        </div>
      </section>
      <div className="container mx-auto px-4">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : shops.length === 0 ? (
          <div>No shops found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopListPage;
