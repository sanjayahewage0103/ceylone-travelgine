import React from 'react';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import CreateTourPackageModal from './CreateTourPackageModal';

const GuideSidebar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: Replace with actual guideId and token from context/store
  const guideId = window.localStorage.getItem('guideId');
  const token = window.localStorage.getItem('token');

  return (
    <aside
      className="w-64 min-h-screen flex flex-col p-6 relative"
      style={{
        background: `linear-gradient(120deg, rgba(0,212,255,0.18) 0%, rgba(9,121,113,0.10) 100%), url('/Ceylon.png') center/cover no-repeat fixed`,
        backgroundBlendMode: 'overlay',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        borderRight: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl z-0" style={{borderRadius: 0}} />
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl font-bold text-cyan-700 mb-6 drop-shadow">Guide Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/guide/profile" className="text-gray-700 hover:text-cyan-700 font-medium">Profile</Link>
          <Link to="/guide/events" className="text-gray-700 hover:text-cyan-700 font-medium">Events</Link>
          <Link to="/guide/calendar-notes" className="text-gray-700 hover:text-cyan-700 font-medium">Calendar & Notes</Link>
          <Link to="/guide/tourist-forecast" className="text-gray-700 hover:text-cyan-700 font-medium">Tourist Forecast</Link>
          <Link to="/guide/settings" className="text-gray-700 hover:text-cyan-700 font-medium">Settings</Link>
          <Link to="/guide/tour-packages" className="text-gray-700 hover:text-cyan-700 font-medium">Manage Tour Packages</Link>
          <Link to="/guide/manage-bookings" className="text-gray-700 hover:text-cyan-700 font-medium">Manage Bookings</Link>
          <Link to="/guide/blogs" className="text-gray-700 hover:text-cyan-700 font-medium">My Blogs</Link>
        </nav>
        <div className="mt-auto pt-8">
          <Link to="/" className="text-cyan-700 underline font-semibold">Home</Link>
        </div>
        {modalOpen && (
          <CreateTourPackageModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            guideId={guideId}
            token={token}
            onCreated={() => {}}
          />
        )}
      </div>
    </aside>
  );
};

export default GuideSidebar;
