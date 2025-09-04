import React from 'react';
import GuideSidebar from '../../components/guide/GuideSidebar';
// import GuideCalendar from '../../components/guide/GuideCalendar'; // Placeholder for calendar

const guideProfile = {
  profilePicture: '/uploads/guide-profile.jpg', // Placeholder
  fullName: 'Saman Perera',
  sltdRegNum: 'SLTD-GUIDE-001',
  bio: 'Experienced tour guide specializing in cultural and nature tours across Sri Lanka. Passionate about sharing local history and traditions.',
  languages: ['English', 'Sinhala', 'German'],
  contact: {
    email: 'saman.perera@example.com',
    phone: '+94 77 1234567',
  },
  status: 'Approved',
  rating: 4.8,
};

const GuideProfilePage = () => {
  return (
    <div className="flex min-h-screen">
      <GuideSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {/* Profile Overview */}
        <div className="bg-white rounded shadow p-8 flex flex-col md:flex-row items-center mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
            <img
              src={guideProfile.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow"
            />
          </div>
          {/* Left Section */}
          <div className="flex-1 md:mr-8">
            <h2 className="text-2xl font-bold mb-2">{guideProfile.fullName}</h2>
            <div className="text-gray-600 mb-1">SLTD Reg #: <span className="font-mono">{guideProfile.sltdRegNum}</span></div>
            <div className="mb-2 text-gray-700">{guideProfile.bio}</div>
            <div className="mb-2">
              <span className="font-semibold">Languages:</span> {guideProfile.languages.join(', ')}
            </div>
          </div>
          {/* Right Section */}
          <div className="flex flex-col items-start md:items-end">
            <div className="mb-2">
              <span className="font-semibold">Contact:</span>
              <div className="text-gray-700">{guideProfile.contact.email}</div>
              <div className="text-gray-700">{guideProfile.contact.phone}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">{guideProfile.status}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Rating:</span> <span className="text-yellow-500 font-bold">{guideProfile.rating} ★</span>
            </div>
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
