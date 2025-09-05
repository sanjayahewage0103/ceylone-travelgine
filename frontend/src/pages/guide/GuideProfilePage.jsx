import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideSidebar from '../../components/guide/GuideSidebar';
import guideService from '../../services/guideService';
import Modal from 'react-modal';
import ProfilePictureUploader from '../../components/guide/ProfilePictureUploader';
import BannerUploader from '../../components/guide/BannerUploader';
Modal.setAppElement('#root');







const GuideProfilePage = () => {
  // Helper to prefix backend host to image URLs if needed
  const backendHost = 'http://localhost:5000';
  const getImageUrl = (url) => {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('/uploads/')) return `${backendHost}${url}`;
    return url;
  };
  const handleEditSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('fullName', editData.fullName);
      formData.append('bio', editData.bio);
      formData.append('languagesSpoken', editData.languagesSpoken);
      formData.append('contact', editData.contact);
      formData.append('email', editData.email);
      if (profilePicFile) formData.append('profilePic', profilePicFile);
      if (bannerFile) formData.append('banner', bannerFile);
      await guideService.updateProfile(token, formData, true);
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    const fetchProfileAndAnalytics = async () => {
      setLoading(true);
      setError('');
      setAnalyticsLoading(true);
      setAnalyticsError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/guide');
        return;
      }
      try {
        const data = await guideService.getProfile(token);
        setProfile(data);
        // Fetch analytics for this guide
        const guideId = data._id || data.id;
        if (guideId) {
          const res = await fetch(`/api/guides/${guideId}/analytics`);
          if (!res.ok) throw new Error('Failed to fetch analytics');
          const analyticsData = await res.json();
          setAnalytics(analyticsData);
        } else {
          setAnalyticsError('Guide ID not found');
        }
      } catch (err) {
        if (err.message === 'Not authenticated' || err.message === 'jwt expired' || err.message === 'jwt malformed') {
          localStorage.removeItem('token');
          navigate('/guide');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
        setAnalyticsLoading(false);
      }
    };
    fetchProfileAndAnalytics();
  }, [navigate]);

  const handleEditClick = () => {
    if (!profile || !profile.guideProfile) return;
    setEditData({
      fullName: profile.fullName || '',
      bio: profile.guideProfile.bio || '',
      languagesSpoken: profile.guideProfile.languagesSpoken?.join(', ') || '',
      contact: profile.contact || '',
      email: profile.email || '',
      profilePicUrl: profile.guideProfile.files?.profilePicUrl || '',
      bannerUrl: profile.guideProfile.files?.profileBanner || '',
    });
    setProfilePicPreview(profile.guideProfile.files?.profilePicUrl || null);
    setBannerPreview(profile.guideProfile.files?.profileBanner || null);
    setProfilePicFile(null);
    setBannerFile(null);
    setEditOpen(true);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = e => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Guard clause to prevent usage of guideProfile before it is defined
  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!profile || !profile.guideProfile) return <div className="p-8">No guide profile found.</div>;
  const guideProfile = profile.guideProfile;
  const user = profile;


  // Build key insights from analytics
  let keyInsights = [
    { label: 'Total Trips', value: analytics?.completedTrips ?? '-' },
    { label: 'Total Income (YTD)', value: analytics?.totalRevenue ? `LKR ${analytics.totalRevenue.toLocaleString()}` : '-', highlight: true },
    { label: 'Upcoming Bookings', value: analytics?.upcomingCount ?? '-' },
    { label: 'Next Booking', value: analytics?.nextBooking ? new Date(analytics.nextBooking.date).toLocaleDateString() : '-', highlight: true },
    { label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 'Today', weather: true },
  ];

  // Revenue chart data
  let revenueData = [];
  if (analytics?.monthlyRevenue) {
    // monthlyRevenue: [{_id: {year, month}, total}]
    revenueData = analytics.monthlyRevenue.map(m => ({
      month: `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m._id.month-1]}`,
      value: m.total
    }));
  }

  // Event calendar: show all bookings (date, tourist, package)
  let eventCalendar = [];
  if (analytics?.eventCalendar) {
    eventCalendar = analytics.eventCalendar.slice(-6).map(b => ({
      date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      name: b.touristName || b.tourist || 'Tourist',
      note: b.tourPackageName || b.package || '',
    }));
  }

  // Pending booking requests (show up to 3, +more if available)
  let bookingRequests = [];
  let morePending = 0;
  if (analytics?.pendingBookings) {
    bookingRequests = analytics.pendingBookings.slice(0,3).map(b => ({
      tourist: b.touristName || b.tourist || 'Tourist',
      package: b.tourPackageName || b.package || '',
      date: new Date(b.date).toLocaleDateString(),
      pax: b.pax || b.guests || '',
    }));
    morePending = analytics.pendingBookings.length - 3;
  }

  return (
    <div className="flex min-h-screen bg-[#1a2236]">
      <GuideSidebar />
      <main className="flex-1 p-8">
        {/* Banner */}
        <BannerUploader
          imageUrl={getImageUrl(guideProfile.files?.profileBanner)}
          onChange={handleBannerChange}
          label="Banner"
          editable={true}
        />
        {/* Profile & Key Insights */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <div className="flex flex-col items-center md:items-start md:flex-row md:mr-8">
            <ProfilePictureUploader
              imageUrl={getImageUrl(guideProfile.files?.profilePicUrl)}
              onChange={handleProfilePicChange}
              label="Profile Picture"
              editable={true}
            />
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
              <div className="text-gray-300 mb-1">{guideProfile.bio}</div>
              <div className="text-gray-400 text-sm mb-1">SLTDA: {guideProfile.sltdaRegNum} <span className="ml-2">Languages: {guideProfile.languagesSpoken?.join(', ')}</span> <span className="ml-2">Experience: {guideProfile.experienceYears} Years</span></div>
              <div className="text-cyan-300 text-xs mb-1">Specialities: {guideProfile.tourTypesOffered?.join(', ')}</div>
            </div>
          </div>
          <button className="ml-auto bg-gray-700 text-white px-4 py-2 rounded font-semibold shadow" onClick={handleEditClick}>Manage Profile</button>
        <Modal
          isOpen={editOpen}
          onRequestClose={() => setEditOpen(false)}
          className="bg-white rounded-xl p-8 max-w-lg mx-auto mt-24 shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form className="space-y-4">
            <ProfilePictureUploader
              imageUrl={profilePicPreview ? profilePicPreview : getImageUrl(editData?.profilePicUrl)}
              onChange={handleProfilePicChange}
              label="Profile Picture"
              editable={true}
            />
            <BannerUploader
              imageUrl={bannerPreview ? bannerPreview : getImageUrl(editData?.bannerUrl)}
              onChange={handleBannerChange}
              label="Banner"
              editable={true}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input name="fullName" value={editData?.fullName || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea name="bio" value={editData?.bio || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Languages Spoken (comma separated)</label>
              <input name="languagesSpoken" value={editData?.languagesSpoken || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input name="contact" value={editData?.contact || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" value={editData?.email || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-4 mt-6">
              <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditOpen(false)}>Cancel</button>
              <button type="button" className="bg-cyan-600 text-white px-4 py-2 rounded font-bold" onClick={handleEditSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
        </div>
        {/* Key Insights */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {analyticsLoading ? (
            <div className="col-span-5 text-center text-white">Loading analytics...</div>
          ) : analyticsError ? (
            <div className="col-span-5 text-center text-red-400">{analyticsError}</div>
          ) : (
            keyInsights.map((insight, i) => (
              <div key={i} className={`rounded-xl p-4 shadow text-center ${insight.highlight ? 'bg-[#222e50] text-cyan-300 font-bold' : 'bg-[#222e50] text-white'} ${insight.weather ? 'flex flex-col justify-center items-center' : ''}`}>
                <div className="text-lg font-semibold">{insight.label}</div>
                <div className="text-2xl mt-2">{insight.value}</div>
              </div>
            ))
          )}
        </div>
        {/* Revenue Chart & Event Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-[#222e50] rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Last 6 Months Revenue</h3>
            <div className="w-full h-48 flex items-end gap-4">
              {revenueData.length === 0 ? (
                <div className="text-white">No revenue data</div>
              ) : (
                revenueData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full">
                    <div className="w-10 bg-cyan-400 rounded-t" style={{ height: `${d.value / 60}px` }}></div>
                    <div className="text-xs text-gray-300 mt-2">{d.month}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-[#222e50] rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Event Calendar</h3>
            <ul className="space-y-3">
              {eventCalendar.length === 0 ? (
                <li className="text-white">No events</li>
              ) : (
                eventCalendar.map((event, i) => (
                  <li key={i} className="bg-[#1a2236] rounded p-3 text-white flex flex-col">
                    <span className="font-bold text-cyan-300">{event.date}</span>
                    <span>{event.name}</span>
                    <span className="text-xs text-gray-400">{event.note}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        {/* Pending Booking Requests */}
        <div className="bg-[#222e50] rounded-xl p-6 shadow">
          <h3 className="text-lg font-bold text-white mb-4">Pending Booking Requests</h3>
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="text-cyan-300">
                <th className="px-4 py-2 text-left">Tourist</th>
                <th className="px-4 py-2 text-left">Package</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Pax</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingRequests.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-white">No pending requests</td></tr>
              ) : (
                bookingRequests.map((req, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="px-4 py-2">{req.tourist}</td>
                    <td className="px-4 py-2">{req.package}</td>
                    <td className="px-4 py-2">{req.date}</td>
                    <td className="px-4 py-2">{req.pax}</td>
                    <td className="px-4 py-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">Approve</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded">Decline</button>
                    </td>
                  </tr>
                ))
              )}
              {morePending > 0 && (
                <tr><td colSpan="5" className="text-center text-cyan-300">+{morePending} more pending requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default GuideProfilePage;
