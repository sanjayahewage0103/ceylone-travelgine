import React from 'react';
import MainNavbar from '../common/MainNavbar';
import MarketplaceNavbar from './MarketplaceNavbar';
import Footer from '../common/Footer';

const MarketplaceLayout = ({ children, search, setSearch, onSearch }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 min-h-screen flex flex-col">
      {/* Background pattern for depth */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Fixed circular gradients for enhanced depth */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-20 animate-float-slow"></div>
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float-slow-reverse"></div>
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-teal-200 rounded-full filter blur-3xl opacity-10 animate-float-medium"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 shadow-sm border-b border-white/20">
          <MainNavbar />
          <MarketplaceNavbar search={search} setSearch={setSearch} onSearch={onSearch} />
        </div>
        
        <div className="flex-grow">
          {children}
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default MarketplaceLayout;
