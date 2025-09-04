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

  return (
    <div className="flex min-h-screen">
      <GuideSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage My Tour Packages</h1>
          <button
            className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
            onClick={() => setCreateOpen(true)}
          >
            + Add New Tour
          </button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <TourPackageCard key={pkg._id} pkg={pkg} onClick={() => setSelected(pkg)} />
          ))}
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
