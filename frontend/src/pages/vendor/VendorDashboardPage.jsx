import React, { useEffect, useState } from 'react';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import VendorProfileHeader from '../../components/vendor/VendorProfileHeader';
import VendorProfileDetails from '../../components/vendor/VendorProfileDetails';
import vendorService from '../../services/vendorService';

const VendorDashboardPage = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch vendor profile from backend
    vendorService.getProfile()
      .then(data => {
        setVendor(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load vendor profile. Please login again.');
        setLoading(false);
      });
  }, []);

  const handleProfileUpdate = async (updatedFields) => {
    setLoading(true);
    try {
      const updated = await vendorService.updateProfile(updatedFields);
      setVendor(updated);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <VendorProfileHeader vendor={vendor} onEdit={() => setEditMode(true)} />
        <VendorProfileDetails 
          vendor={vendor} 
          editMode={editMode} 
          onSave={handleProfileUpdate} 
          onCancel={() => setEditMode(false)}
        />
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">My Marketplace</h2>
          {/* Future: Product cards go here */}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardPage;
