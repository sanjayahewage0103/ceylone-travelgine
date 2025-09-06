import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../components/common/MainNavbar';

const BusinessIntro = () => {
  return (
    <>
      <MainNavbar />
      
      {/* Hero Section with Background */}
      <section 
        className="w-full min-h-screen bg-cover bg-center flex items-center py-20"
        style={{ 
          backgroundImage: 'url("/Ceylon.png")',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join Ceylon Travelgine: <span className="text-teal-400">Grow Your Tourism Business</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with Travelers Who Truly Value Your Expertise
            </p>
            <Link 
              to="/business/register" 
              className="bg-teal-500 hover:bg-teal-600 text-white text-lg font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Register Now →
            </Link>
          </div>
          
          {/* Introduction Card */}
          <div 
            className="rounded-xl p-8 mb-16 max-w-4xl mx-auto"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <p className="text-white text-lg leading-relaxed">
              As a licensed tour guide or authentic Sri Lankan vendor, you deserve to connect with travelers who genuinely appreciate your services and products. Ceylon Travelgine's AI-powered platform puts you directly in front of the right audience—travelers specifically seeking your expertise and offerings.
            </p>
          </div>
          
          {/* Why Join Section */}
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
            Why Join Our Platform?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Tour Guides Card */}
            <div 
              className="rounded-xl p-8 h-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 className="text-2xl font-bold text-white mb-8">For Tour Guides:</h3>
              <ul className="space-y-5">
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">📈</span>
                  <span>
                    <strong className="text-teal-300">Smart Matching System:</strong> Get connected with travelers whose interests perfectly match your expertise
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">📊</span>
                  <span>
                    <strong className="text-teal-300">Demand Forecasting:</strong> See upcoming tourist trends in your area to plan better
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">⭐</span>
                  <span>
                    <strong className="text-teal-300">Reputation Dashboard:</strong> Build your profile with verified reviews and ratings
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">💬</span>
                  <span>
                    <strong className="text-teal-300">Direct Booking:</strong> Streamline your scheduling and payments through our platform
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">📝</span>
                  <span>
                    <strong className="text-teal-300">Content Sharing:</strong> Share your knowledge through our blog platform to attract more clients
                  </span>
                </li>
              </ul>
            </div>
            
            {/* For Vendors Card */}
            <div 
              className="rounded-xl p-8 h-full"
              style={{
                background: 'rgba(82, 43, 137, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 className="text-2xl font-bold text-white mb-8">For Vendors:</h3>
              <ul className="space-y-5">
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">🌟</span>
                  <span>
                    <strong className="text-teal-300">Targeted Visibility:</strong> Reach travelers actively searching for your authentic Sri Lankan products
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">📉</span>
                  <span>
                    <strong className="text-teal-300">Inventory Forecasting:</strong> Predict demand for your offerings based on seasonal trends
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">📈</span>
                  <span>
                    <strong className="text-teal-300">Performance Analytics:</strong> Understand your market position with detailed sales insights
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">🛒</span>
                  <span>
                    <strong className="text-teal-300">E-Marketplace Integration:</strong> Sell directly through our platform with minimal commission
                  </span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-teal-400 text-2xl mr-4">🎯</span>
                  <span>
                    <strong className="text-teal-300">Promotion Tools:</strong> Create special offers for specific traveler segments
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Final CTA Section */}
          <div 
            className="rounded-xl p-8 mt-16 max-w-4xl mx-auto text-center"
            style={{
              background: 'rgba(0,102,102,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Sri Lanka's First AI-Powered Tourism Ecosystem
            </h2>
            <p className="text-white text-lg mb-8 leading-relaxed">
              Ceylon Travelgine is more than just another booking platform—it's a complete ecosystem designed specifically for Sri Lankan tourism professionals. Our AI technology understands Sri Lanka's unique tourism patterns, from monsoon seasons to cultural events, ensuring you connect with travelers at the right time with the right offerings.
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Register Now</h3>
              <p className="text-white">
                Join hundreds of licensed guides and authentic vendors already growing their businesses through Ceylon Travelgine. Registration takes less than 5 minutes, and our team will personally guide you through the onboarding process to ensure your success on the platform.
              </p>
            </div>
            <Link 
              to="/business/register" 
              className="bg-white text-teal-700 hover:bg-teal-100 text-lg font-bold py-4 px-10 rounded-full inline-block transition-all transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BusinessIntro;
