import React, { useEffect, useState } from 'react';
import tourPackageService from '../services/tourPackageService';
import TourPackageCard from '../components/guide/TourPackageCard';
import TourPackageModal from '../components/guide/TourPackageModal';
import GuideSidebar from '../components/guide/GuideSidebar';
import CreateTourPackageModal from '../components/guide/CreateTourPackageModal';

const TourPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // for modal
  const [createOpen, setCreateOpen] = useState(false);

  const fetchPackages = () => {
    setLoading(true);
    setError('');
    const guideId = window.localStorage.getItem('guideId');
    if (!guideId) {
      setError('Guide not logged in.');
      setLoading(false);
      return;
    }
    tourPackageService.getTourPackagesByGuide(guideId)
      .then(setPackages)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  React.useEffect(fetchPackages, []);

  const guideId = window.localStorage.getItem('guideId');
  const token = window.localStorage.getItem('token');

  // Example background image (replace with your own or fetch from backend if available)
  const backgroundImage = '/public/3.jpg';

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `linear-gradient(120deg, rgba(0,212,255,0.10) 0%, rgba(9,121,113,0.10) 100%), url('${backgroundImage}') center/cover no-repeat fixed`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <GuideSidebar />
      <div className="flex-1 p-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-cyan-900 drop-shadow">Manage My Tour Packages</h1>
            <button
              className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-xl font-bold shadow hover:from-cyan-700 hover:to-teal-600 transition-all"
              onClick={() => setCreateOpen(true)}
            >
              + Add New Tour
            </button>
          </div>
          {loading && <div className="text-cyan-700">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <TourPackageCard key={pkg._id} pkg={pkg} onClick={() => setSelected(pkg)} />
            ))}
          </div>
        </div>
        {selected && (
          <TourPackageModal
            pkg={selected}
            onClose={() => setSelected(null)}
            onSaved={fetchPackages}
          />
        )}
        {createOpen && (
          <CreateTourPackageModal
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            guideId={guideId}
            token={token}
            onCreated={fetchPackages}
          />
        )}
      </div>
    </div>
  );
};

export default TourPackageManager;
