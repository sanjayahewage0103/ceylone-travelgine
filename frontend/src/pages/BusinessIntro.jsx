import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../components/common/MainNavbar';
import Footer from '../components/common/Footer';

// Icon Components
const Icons = {
  Guide: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  Vendor: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0-6.75h-3V18m0-6.75h6m-6 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V10.5m0 0h6" />
    </svg>
  ),
  SmartMatching: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  Forecasting: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  Reputation: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
  Content: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
  ),
  Insights: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  Targeted: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  Analytics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  ),
  Marketplace: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  Promotion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
    </svg>
  ),
  Register: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </svg>
  )
};

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Join Ceylon Travelgine: <span className="text-teal-400">Grow Your Tourism Business</span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
              Connect with Travelers Who Truly Value Your Expertise
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Vendor Card */}
              <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-purple-600/80 to-purple-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-40"></div>
                <div className="p-8 relative z-10 flex flex-col items-center">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-full mb-6">
                    <Icons.Vendor />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">For Vendors</h3>
                  <p className="text-white/90 mb-6 text-center">
                    Showcase your authentic Sri Lankan products to travelers who are specifically looking for what you offer.
                  </p>
                  <Link 
                    to="/vendor" 
                    className="bg-white text-purple-700 hover:bg-purple-100 px-8 py-3 rounded-full font-bold transition-all transform group-hover:scale-105 flex items-center gap-2"
                  >
                    Join as Vendor
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Guide Card */}
              <div className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-teal-600/80 to-teal-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-40"></div>
                <div className="p-8 relative z-10 flex flex-col items-center">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-full mb-6">
                    <Icons.Guide />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">For Tour Guides</h3>
                  <p className="text-white/90 mb-6 text-center">
                    Connect with travelers seeking your specific expertise and local knowledge for their Sri Lankan adventures.
                  </p>
                  <Link 
                    to="/guide" 
                    className="bg-white text-teal-700 hover:bg-teal-100 px-8 py-3 rounded-full font-bold transition-all transform group-hover:scale-105 flex items-center gap-2"
                  >
                    Join as Guide
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Introduction Card */}
          <div 
            className="rounded-xl p-8 mb-16 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="hidden md:block flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-teal-400 mb-4 md:text-left text-center">Our AI-Powered Platform</h2>
                <p className="text-white text-lg leading-relaxed">
                  As a licensed tour guide or authentic Sri Lankan vendor, you deserve to connect with travelers who genuinely appreciate your services and products. Ceylon Travelgine's AI-powered platform puts you directly in front of the right audience—travelers specifically seeking your expertise and offerings.
                </p>
              </div>
            </div>
          </div>
          
          {/* Why Join Section */}
          <div className="text-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why Join Our <span className="text-teal-400">Platform</span>?
              </h2>
            </div>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Our AI-powered platform connects you with travelers seeking authentic experiences in Sri Lanka
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Tour Guides Card */}
            <div 
              className="rounded-xl p-8 h-full transform hover:scale-[1.01] transition-all duration-300"
              style={{
                background: 'rgba(0,102,102,0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-teal-500/30 rounded-full">
                  <Icons.Guide />
                </div>
                <h3 className="text-2xl font-bold text-white">For Tour Guides:</h3>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-teal-500/20 rounded-full mr-4 group-hover:bg-teal-500/40 transition-colors">
                    <Icons.SmartMatching />
                  </div>
                  <span>
                    <strong className="text-teal-300">Smart Matching System:</strong> Get connected with travelers whose interests perfectly match your expertise
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-teal-500/20 rounded-full mr-4 group-hover:bg-teal-500/40 transition-colors">
                    <Icons.Forecasting />
                  </div>
                  <span>
                    <strong className="text-teal-300">Demand Forecasting:</strong> See upcoming tourist trends in your area to plan better
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-teal-500/20 rounded-full mr-4 group-hover:bg-teal-500/40 transition-colors">
                    <Icons.Reputation />
                  </div>
                  <span>
                    <strong className="text-teal-300">Reputation Dashboard:</strong> Build your profile with verified reviews and ratings
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-teal-500/20 rounded-full mr-4 group-hover:bg-teal-500/40 transition-colors">
                    <Icons.Content />
                  </div>
                  <span>
                    <strong className="text-teal-300">Content Sharing:</strong> Share your knowledge through our blog platform to attract more clients
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-teal-500/20 rounded-full mr-4 group-hover:bg-teal-500/40 transition-colors">
                    <Icons.Insights />
                  </div>
                  <span>
                    <strong className="text-teal-300">Insights and Data:</strong> Streamline your scheduling and payments through our platform
                  </span>
                </li>
              </ul>
            </div>
            
            {/* For Vendors Card */}
            <div 
              className="rounded-xl p-8 h-full transform hover:scale-[1.01] transition-all duration-300"
              style={{
                background: 'rgba(82, 43, 137, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/30 rounded-full">
                  <Icons.Vendor />
                </div>
                <h3 className="text-2xl font-bold text-white">For Vendors:</h3>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/40 transition-colors">
                    <Icons.Targeted />
                  </div>
                  <span>
                    <strong className="text-teal-300">Targeted Visibility:</strong> Reach travelers actively searching for your authentic Sri Lankan products
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/40 transition-colors">
                    <Icons.Forecasting />
                  </div>
                  <span>
                    <strong className="text-teal-300">Inventory Forecasting:</strong> Predict demand for your offerings based on seasonal trends
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/40 transition-colors">
                    <Icons.Analytics />
                  </div>
                  <span>
                    <strong className="text-teal-300">Performance Analytics:</strong> Understand your market position with detailed sales insights
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/40 transition-colors">
                    <Icons.Marketplace />
                  </div>
                  <span>
                    <strong className="text-teal-300">E-Marketplace Integration:</strong> Sell directly through our platform with minimal commission
                  </span>
                </li>
                
                <li className="flex items-start text-white group">
                  <div className="p-2 bg-purple-500/20 rounded-full mr-4 group-hover:bg-purple-500/40 transition-colors">
                    <Icons.Promotion />
                  </div>
                  <span>
                    <strong className="text-teal-300">Promotion Tools:</strong> Create special offers for specific traveler segments
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Final CTA Section */}
          <div 
            className="rounded-xl p-10 mt-16 max-w-4xl mx-auto text-center transform hover:scale-[1.01] transition-all duration-300"
            style={{
              background: 'rgba(0,102,102,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)'
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-teal-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Sri Lanka's First AI-Powered Tourism Ecosystem
            </h2>
            
            <div className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 p-6 rounded-lg my-8">
              <p className="text-white text-lg leading-relaxed">
                Ceylon Travelgine is more than just another booking platform—it's a complete ecosystem designed specifically for Sri Lankan tourism professionals. Our AI technology understands Sri Lanka's unique tourism patterns, from monsoon seasons to cultural events, ensuring you connect with travelers at the right time with the right offerings.
              </p>
            </div>
            
            <div className="mb-8 bg-black/30 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4 gap-3">
                <Icons.Register />
                <h3 className="text-xl font-bold text-teal-300">Register Now</h3>
              </div>
              <p className="text-white">
                Join hundreds of licensed guides and authentic vendors already growing their businesses through Ceylon Travelgine. Registration takes less than 5 minutes, and our team will personally guide you through the onboarding process to ensure your success on the platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/vendor" 
                className="bg-white hover:bg-purple-50 text-purple-700 text-lg font-bold py-4 px-10 rounded-full inline-flex items-center justify-center gap-3 transition-all transform hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Icons.Vendor />
                Register as Vendor
              </Link>
              <Link 
                to="/guide" 
                className="bg-white hover:bg-teal-50 text-teal-700 text-lg font-bold py-4 px-10 rounded-full inline-flex items-center justify-center gap-3 transition-all transform hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Icons.Guide />
                Register as Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default BusinessIntro;
