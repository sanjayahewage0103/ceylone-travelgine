import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* The main content area */}
      <div className="flex-grow">
        <Outlet />
      </div>
      
      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default MainLayout;
