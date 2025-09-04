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
    <aside className="w-64 bg-white border-r shadow flex flex-col min-h-screen p-6">
      <h2 className="text-xl font-bold text-cyan-700 mb-6">Guide Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/guide/profile" className="text-gray-700 hover:text-cyan-700 font-medium">Profile</Link>
        <Link to="/guide/events" className="text-gray-700 hover:text-cyan-700 font-medium">Events</Link>
        <Link to="/guide/calendar" className="text-gray-700 hover:text-cyan-700 font-medium">Calendar</Link>
        <Link to="/guide/settings" className="text-gray-700 hover:text-cyan-700 font-medium">Settings</Link>
  <Link to="/guide/tour-packages" className="text-gray-700 hover:text-cyan-700 font-medium">Manage Tour Packages</Link>
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
    </aside>
  );
};

export default GuideSidebar;
