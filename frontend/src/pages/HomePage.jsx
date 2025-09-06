// HomePage.jsx: Simple navigation page

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../components/common/MainNavbar';

const HomePage = () => {
  return (
    <>
    <MainNavbar />
  <div className="relative w-full h-[600px] max-h-[600px] overflow-hidden flex flex-col">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/13809264_2560_1440_60fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Glassmorphism Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between z-10">
        <div className="flex flex-col items-start justify-center h-full pl-8 md:pl-16 lg:pl-24" style={{maxWidth: '700px'}}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg" style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.01em', lineHeight: '1.1'}}>Discover Sri Lanka Smarter,<br />Not Harder.</h1>
          <p className="text-base md:text-lg text-white font-semibold mb-4" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>Your AI-Powered Smart Tourism<br />Platform for Personalized Sri Lankan Experiences</p>
        </div>
        {/* Explore Button at bottom right */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-20">
          <Link to="/smart-itinerary">
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transition text-base md:text-lg tracking-wide" style={{minWidth: '160px'}}>EXPLORE NOW &rarr;</button>
          </Link>
        </div>
      </div>
      {/* Optional: Overlay for darkening video for better text contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/60 z-5 pointer-events-none" />
    </div>

         {/* Second Section: Features Cards (Mockup Accurate) */}
  <section className="w-full pt-0 px-2 md:px-0 flex justify-center items-center bg-transparent">
          <div className="max-w-7xl w-full flex flex-col md:flex-row">
            {/* Left Panel */}
            <div className="flex-1 flex flex-col justify-center items-start p-8 min-w-[270px]" style={{background: '#19b6b6', color: '#fff'}}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M2 12l9 9 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h2 className="text-2xl md:text-3xl font-bold italic mb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>Leave<br/>it to us!</h2>
              <p className="text-base md:text-lg font-medium opacity-90">AI-powered itineraries for Sri Lanka's hidden gems. Experience the island's diversity through personalized journeys. Travel smarter, not harder.</p>
            </div>
            {/* Cards Panel */}
            <div 
              className="flex-[2] w-full p-6 md:p-10 rounded-2xl shadow-xl"
              style={{
                background: 'rgba(10,40,30,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.12)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white rounded-xl shadow-md flex flex-col items-start overflow-hidden transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:z-10">
                  <img src="/1.jpg" alt="Personalized Itineraries" className="w-full h-48 object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Personalized Itineraries</h3>
                    <p className="text-gray-800 text-sm font-medium">Our AI engine crafts custom itineraries based on your interests, budget, and travel style - no more generic tourist traps.</p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-xl shadow-md flex flex-col items-start overflow-hidden transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:z-10">
                  <img src="/2.jpg" alt="Seamless Sri Lankan Travel" className="w-full h-48 object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Seamless Sri Lankan Travel</h3>
                    <p className="text-gray-800 text-sm font-medium">Navigate Sri Lanka's unique geography with route optimization that accounts for monsoon seasons, road conditions, and Poya days</p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-xl shadow-md flex flex-col items-start overflow-hidden transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:z-10">
                  <img src="/3.jpg" alt="Authentic Local Connections" className="w-full h-48 object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Authentic Local Connections</h3>
                    <p className="text-gray-800 text-sm font-medium">Connect directly with licensed guides, trusted vendors, and local experiences that match your preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      {/* Third Section: What We Can Offer You */}
      <section className="w-full py-16 px-4 bg-[#f9f7f1] flex justify-center">
        <div className="max-w-6xl w-full">
          <h2 className="text-4xl font-bold text-center mb-4">
            What We <span className="text-teal-600">Can Offer You</span>
          </h2>
          
          <p className="text-center max-w-3xl mx-auto mb-12 text-gray-700">
            Your AI-powered travel companion for Sri Lanka. Tell us your interests and budget, and we'll
            create a personalized itinerary that matches your travel style. We account for Sri Lanka's unique
            conditions - monsoon patterns, road conditions, and cultural events - so you experience the real
            Sri Lanka, not just the tourist hotspots.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="relative rounded-lg overflow-hidden group">
              <img 
                src="/1.jpg" 
                alt="AI-Powered Itinerary Builder" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg mb-1">AI-Powered Itinerary Builder</h3>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="relative rounded-lg overflow-hidden group">
              <img 
                src="/2.jpg" 
                alt="AI Landmark Recognition" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg mb-1">AI Landmark Recognition</h3>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="relative rounded-lg overflow-hidden group">
              <img 
                src="/3.jpg" 
                alt="AI-Powered Tourism Chatbot" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg mb-1">AI-Powered Tourism Chatbot</h3>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="relative rounded-lg overflow-hidden group">
              <img 
                src="/1.jpg" 
                alt="Traditional Ceylone Marketplace" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg mb-1">Traditional Ceylone Marketplace</h3>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-gray-700 font-medium">
            Connect with travelers whose interests match your expertise
          </p>
        </div>
      </section>

      {/* Fourth Section: Tour Packages (Dynamic) */}
      <TourPackagesSection />

      {/* Fifth Section: Explore Ceylone Products */}
      <ExploreProductsSection />

      {/* Sixth Section: Travelgine for Business */}
      <BusinessSection />
    </>
  );
}

// --- BusinessSection component ---
const BusinessSection = () => {
  return (
    <section 
      className="w-full py-20 relative bg-cover bg-center" 
      style={{ 
        backgroundImage: 'url("/Ceylon.png")',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Travelgine for <span className="text-white">Business</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Licensed Guides Box */}
          <div 
            className="rounded-lg p-8"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">For Licensed Guides</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <ul className="text-white space-y-4 list-none">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Smart Matching System:</strong> Connect with travelers whose interests match your expertise</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Digital Forecasting:</strong> See upcoming tourist trends in your area</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Reputation Dashboard:</strong> Build your profile with consistent quality</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Content sharing:</strong> Share your knowledge through our blog platform</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Insights and data platform:</strong> Streamline your scheduling and payments</span>
              </li>
            </ul>
          </div>
          
          {/* For Vendors Box */}
          <div 
            className="rounded-lg p-8"
            style={{
              background: 'rgba(82, 43, 137, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">For Vendors</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <ul className="text-white space-y-4 list-none">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Targeted Visibility:</strong> Reach travelers interested in your products</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Market Forecasting:</strong> Predict demand for your offerings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Performance Analytics:</strong> Understand your customer preferences</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>E-Marketplace Integration:</strong> Sell directly through our platform</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-teal-400">•</span>
                <span><strong>Promotion Tools:</strong> Create special offers for specific traveler segments</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/business-intro" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-bold transition-colors duration-300 text-lg">
            JOIN NOW →
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- ExploreProductsSection component ---
const ExploreProductsSection = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  // Fetch products from backend
  useEffect(() => {
    // Try multiple base URLs in case proxy isn't set up correctly
    const apiUrls = [
      '/api/products/public',
      'http://localhost:5000/api/products'
    ];
    
    console.log("Attempting to fetch products...");
    
    // Function to attempt fetch from each URL until one succeeds
    const fetchFromUrls = async (urls) => {
      for (const url of urls) {
        try {
          console.log(`Trying API URL for products: ${url}`);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`Failed with status ${response.status} from ${url}`);
            continue;  // Try next URL
          }
          
          const data = await response.json();
          console.log(`Success fetching products from ${url}! Got ${data?.length || 0} products`);
          
          if (data && Array.isArray(data) && data.length > 0) {
            // Set products in state
            setProducts(data);
            return true;  // Success!
          } else {
            console.warn(`API at ${url} returned empty or invalid data`);
          }
        } catch (err) {
          console.error(`Error fetching from ${url}:`, err);
        }
      }
      
      // If we got here, all URLs failed - use mock data
      const mockProducts = [
        {
          _id: 'product1',
          name: 'Ceylone masks',
          description: 'Traditional hand-crafted Sri Lankan masks with cultural significance.',
          price: 3999,
          images: ['/1.jpg']
        },
        {
          _id: 'product2',
          name: 'Vendor Box',
          description: 'A collection of authentic Sri Lankan spices and teas.',
          price: 2999,
          images: ['/2.jpg']
        },
        {
          _id: 'product3',
          name: 'A la Carte Activities',
          description: 'Choose from a variety of cultural and adventure activities.',
          price: 3999,
          images: ['/3.jpg']
        },
        {
          _id: 'product4',
          name: 'Transport & Airport Transfers',
          description: 'Reliable and comfortable transportation services across Sri Lanka.',
          price: 3999,
          images: ['/1.jpg']
        }
      ];
      
      setProducts(mockProducts);
      console.log("Using mock product data since API fetches failed");
      return false;
    };
    
    fetchFromUrls(apiUrls);
  }, []);
  
  // Make sure we have exactly 4 products
  const displayProducts = (() => {
    if (products.length === 0) return [];
    if (products.length >= 4) return products.slice(0, 4);
    
    // If less than 4 products, duplicate some to fill
    const result = [...products];
    while (result.length < 4) {
      result.push({...products[result.length % products.length], _id: `dup-${result.length}`});
    }
    return result;
  })();

  // Helper function to get appropriate image URL
  const getImageUrl = (product, index) => {
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/uploads/')) return `http://localhost:5000${imagePath}`;
      if (imagePath.startsWith('/')) return imagePath;
      return `http://localhost:5000/uploads/${imagePath}`;
    }
    return index === 0 ? '/1.jpg' : index === 1 ? '/2.jpg' : index === 2 ? '/3.jpg' : '/1.jpg';
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'LKR 3,999';
    return `LKR ${Number(price).toLocaleString()}`;
  };
  
  if (displayProducts.length < 4) {
    return null; // Don't render section if we don't have enough products
  }

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: '#006666' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Explore Ceylone Products</h2>
          <p className="text-white/80">Experience the authentic treasures of Sri Lanka</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* First product - Large card (spans 6 columns) */}
          <div className="lg:col-span-6 relative rounded-lg overflow-hidden">
            <div className="relative h-96">
              <img 
                src={getImageUrl(displayProducts[0], 0)} 
                alt={displayProducts[0].name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 text-teal-800 font-bold py-1 px-3 rounded">
                {formatPrice(displayProducts[0].price)}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
              <h3 className="text-white font-semibold text-xl mb-2">{displayProducts[0].name}</h3>
              <p className="text-white/90 text-sm line-clamp-2">{displayProducts[0].description}</p>
              <div className="flex justify-between items-center mt-4">
                <Link to="/marketplace" className="bg-teal-400 hover:bg-teal-500 text-white px-4 py-2 rounded transition-colors text-sm font-medium">
                  EXPLORE NOW →
                </Link>
              </div>
            </div>
          </div>
          
          {/* Second product (spans 6 columns) */}
          <div className="lg:col-span-6">
            <div className="relative h-44 mb-6 rounded-lg overflow-hidden">
              <img 
                src={getImageUrl(displayProducts[1], 1)} 
                alt={displayProducts[1].name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 text-teal-800 font-bold py-1 px-3 rounded">
                {formatPrice(displayProducts[1].price)}
              </div>
              <div className="absolute bottom-0 left-0 p-4 right-0 bg-black/50 backdrop-blur-sm flex justify-between items-end">
                <div>
                  <h3 className="text-white font-semibold text-lg">{displayProducts[1].name}</h3>
                  <p className="text-white/90 text-xs line-clamp-1">{displayProducts[1].description}</p>
                </div>
                <Link 
                  to={`/products/all`}
                  className="bg-teal-400 hover:bg-teal-500 text-white w-7 h-7 rounded-full flex items-center justify-center ml-2 flex-shrink-0 cursor-pointer"
                >
                  →
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Third product */}
              <div className="relative h-44 rounded-lg overflow-hidden">
                <img 
                  src={getImageUrl(displayProducts[2], 2)} 
                  alt={displayProducts[2].name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 right-4 bg-white/90 text-teal-800 font-bold py-1 px-3 rounded">
                  {formatPrice(displayProducts[2].price)}
                </div>
                <div className="absolute bottom-0 left-0 p-4 right-0 bg-black/50 backdrop-blur-sm flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{displayProducts[2].name}</h3>
                    <p className="text-white/90 text-xs line-clamp-1">{displayProducts[2].description}</p>
                  </div>
                  <Link 
                    to={`/products/all`}
                    className="bg-teal-400 hover:bg-teal-500 text-white w-7 h-7 rounded-full flex items-center justify-center ml-2 flex-shrink-0 cursor-pointer"
                  >
                    →
                  </Link>
                </div>
              </div>
              
              {/* Fourth product */}
              <div className="relative h-44 rounded-lg overflow-hidden">
                <img 
                  src={getImageUrl(displayProducts[3], 3)}
                  alt={displayProducts[3].name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 right-4 bg-white/90 text-teal-800 font-bold py-1 px-3 rounded">
                  {formatPrice(displayProducts[3].price)}
                </div>
                <div className="absolute bottom-0 left-0 p-4 right-0 bg-black/50 backdrop-blur-sm flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{displayProducts[3].name}</h3>
                    <p className="text-white/90 text-xs line-clamp-1">{displayProducts[3].description}</p>
                  </div>
                  <Link 
                    to={`/products/all`}
                    className="bg-teal-400 hover:bg-teal-500 text-white w-7 h-7 rounded-full flex items-center justify-center ml-2 flex-shrink-0 cursor-pointer"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- TourPackagesSection component ---
const TourPackagesSection = () => {
  const [tours, setTours] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const intervalRef = useRef(null);

  // Fetch tours from backend
  useEffect(() => {
    // Try multiple base URLs in case proxy isn't set up correctly
    const apiUrls = [
      '/api/tour-packages/public/all',
      'http://localhost:5000/api/tour-packages/public/all'
    ];
    
    console.log("Attempting to fetch tour packages...");
    
    // Function to attempt fetch from each URL until one succeeds
    const fetchFromUrls = async (urls) => {
      for (const url of urls) {
        try {
          console.log(`Trying API URL: ${url}`);
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.warn(`Failed with status ${response.status} from ${url}`);
            continue;  // Try next URL
          }
          
          const data = await response.json();
          console.log(`Success fetching from ${url}! Got ${data?.length || 0} tours`);
          
          if (data && Array.isArray(data) && data.length > 0) {
            // Log detailed data from first tour for debugging
            console.log("Sample tour data:", {
              id: data[0]._id,
              name: data[0].package_name,
              price: data[0].price_lkr,
              description: data[0].description?.substring(0, 50) + "...",
              imageCount: data[0].images?.length || 0
            });
            
            // Set the tours in state
            setTours(data);
            return true;  // Success!
          } else {
            console.warn(`API at ${url} returned empty or invalid data`);
          }
        } catch (err) {
          console.error(`Error fetching from ${url}:`, err);
        }
      }
      
      // If we got here, all URLs failed
      console.error("All API URLs failed, no tour data available");
      return false;
    };
    
    // Execute the fetch attempts
    fetchFromUrls(apiUrls).then(success => {
      if (!success) {
        console.log("Using fallback data since API fetches failed");
        setTours([]);  // Don't set mock data - we'll handle display based on this empty state
      }
    });
  }, []);

  // Switch displayed tours every 10s
  useEffect(() => {
    if (tours.length <= 3) return;
    intervalRef.current = setInterval(() => {
      setStartIdx(prev => (prev + 3) % tours.length);
    }, 10000);
    return () => clearInterval(intervalRef.current);
  }, [tours]);

  // Always show exactly 3 tours
  const displayTours = (() => {
    if (tours.length === 0) {
      // Create 3 placeholder tours if no tours are available
      return [
        { 
          _id: 'placeholder1', 
          package_name: 'Self-Paced Tour', 
          price_lkr: 39900, 
          description: 'Explore Sri Lanka at your own pace with our carefully crafted self-guided tour packages. Includes detailed itineraries and local insights.' 
        },
        { 
          _id: 'placeholder2', 
          package_name: 'Semi-Guided Tour', 
          price_lkr: 49900, 
          description: 'Get the best of both worlds with our semi-guided tours - flexibility with expert guidance when you need it.' 
        },
        { 
          _id: 'placeholder3', 
          package_name: 'Fully Guided Tour', 
          price_lkr: 59900, 
          description: 'Experience Sri Lanka to the fullest with our expert guides showing you hidden gems and local experiences.' 
        }
      ];
    } else if (tours.length >= 3) {
      // If we have 3 or more tours, get the appropriate slice
      return [...tours, ...tours].slice(startIdx, startIdx + 3);
    } else {
      // If we have 1 or 2 tours, pad the array to exactly 3
      const padding = Array(3 - tours.length).fill().map((_, idx) => ({
        ...tours[0],
        _id: `padding${idx}`,
        package_name: tours[0].package_name ? 
          (idx === 0 ? 'Semi-Guided ' + tours[0].package_name : 'Fully Guided ' + tours[0].package_name) : 
          (idx === 0 ? 'Semi-Guided Tour' : 'Fully Guided Tour'),
        price_lkr: tours[0].price_lkr ? 
          (idx === 0 ? Math.round(Number(tours[0].price_lkr) * 1.25) : Math.round(Number(tours[0].price_lkr) * 1.5)) : 
          (idx === 0 ? 49900 : 59900),
        description: tours[0].description ? tours[0].description : 
          (idx === 0 ? 'Semi-guided version of our popular tour with more flexibility and expert guidance when needed.' : 
                      'Premium version with full expert guidance throughout your Sri Lankan journey.')
      }));
      return [...tours, ...padding];
    }
  })();

  return (
    <section className="w-full py-12 px-4 flex justify-center items-center" style={{background: '#f9f8f0'}}>
      <div className="w-full flex flex-col">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Ceylon <span className="text-teal-600">Adventures</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-8 justify-center w-full">
          {displayTours.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">No tours available.</div>
          ) : displayTours.map((tour, idx) => (
            <div key={tour._id || idx} className="flex flex-col items-center">
              {/* Image Container with Title and Price Overlay */}
              <div className="relative rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300" style={{width: '300px', height: '300px'}}>
                <img 
                  src={(() => {
                    // Handle image from backend properly
                    if (tour.images && tour.images.length > 0) {
                      const imagePath = tour.images[0];
                      // If image is from backend and starts with /uploads
                      if (imagePath.startsWith('/uploads/')) {
                        return `http://localhost:5000${imagePath}`;
                      }
                      // If image path starts with http or / it's already a full path
                      if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
                        return imagePath;
                      }
                      // Otherwise, construct the path to backend uploads folder
                      return `http://localhost:5000/uploads/${imagePath}`;
                    }
                    // Fallback to default images
                    return idx === 0 ? '/1.jpg' : idx === 1 ? '/2.jpg' : '/3.jpg';
                  })()}
                  alt={tour.package_name || 'Tour package'} 
                  className="w-full h-full object-cover" 
                  style={{width: '300px', height: '300px'}}
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.src = idx === 0 ? '/1.jpg' : 
                                   idx === 1 ? '/2.jpg' : '/3.jpg';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center" style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                  paddingTop: '30px'
                }}>
                  <h3 className="text-white font-semibold text-base drop-shadow-md">
                    {tour.package_name || 'Tour Package'}
                  </h3>
                  <span className="text-white font-semibold text-base drop-shadow-md">
                    {(() => {
                      // Handle different potential price formats
                      if (tour.price_lkr !== undefined && tour.price_lkr !== null) {
                        const price = Number(tour.price_lkr);
                        if (!isNaN(price)) {
                          // Keep prices in LKR currency format
                          return `LKR ${price.toLocaleString()}`;
                        }
                      }
                      // Fallback prices
                      return idx === 0 ? 'LKR 39,900' : idx === 1 ? 'LKR 49,900' : 'LKR 59,900';
                    })()}
                  </span>
                </div>
              </div>
              
              {/* Description and Arrow - Outside the card */}
              <div className="flex justify-between items-center mt-2" style={{width: '300px'}}>
                <p className="text-gray-700 text-xs line-clamp-2 pr-3" style={{maxWidth: '85%'}}>
                  {tour.description ? 
                    (tour.description.length > 100 ? tour.description.substring(0, 100) + '...' : tour.description) 
                    : "Experience the beauty of Sri Lanka with this amazing tour package."}
                </p>
                <Link 
                  to={`/tours/${tour._id}`}
                  className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <span className="text-xs">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
    
export default HomePage;