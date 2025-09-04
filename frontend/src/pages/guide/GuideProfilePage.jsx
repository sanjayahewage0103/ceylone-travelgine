
import React, { useEffect, useState } from 'react';
import GuideSidebar from '../../components/guide/GuideSidebar';
import guideService from '../../services/guideService';

const GuideProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const data = await guideService.getProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!profile || !profile.guideProfile) return <div className="p-8">No guide profile found.</div>;

  const guideProfile = profile.guideProfile;
  const user = profile;

  return (
    <div className="flex min-h-screen">
      <GuideSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {/* Profile Overview */}
        <div className="bg-white rounded shadow p-8 flex flex-col md:flex-row items-center mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
            <img
              src={guideProfile.files?.profilePicUrl || '/uploads/guide-profile.jpg'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow"
            />
          </div>
          {/* Left Section */}
          <div className="flex-1 md:mr-8">
            <h2 className="text-2xl font-bold mb-2">{user.fullName}</h2>
            <div className="text-gray-600 mb-1">SLTD Reg #: <span className="font-mono">{guideProfile.sltdaRegNum}</span></div>
            <div className="mb-2 text-gray-700">{guideProfile.bio}</div>
            <div className="mb-2">
              <span className="font-semibold">Languages:</span> {guideProfile.languagesSpoken?.join(', ')}
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col items-start md:items-end">
            <div className="mb-2">
              <span className="font-semibold">Contact:</span>
              <div className="text-gray-700">{user.email}</div>
              <div className="text-gray-700">{user.contact}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">{guideProfile.status}</span>
            </div>
            {/* Rating placeholder */}
          </div>
        </div>
        {/* Event Calendar Section */}
        <div className="bg-white rounded shadow p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Assigned Events & Calendar</h3>
          {/* <GuideCalendar /> */}
          <div className="text-gray-500">Calendar integration coming soon...</div>
        </div>
      </main>
    </div>
  );
};

export default GuideProfilePage;
