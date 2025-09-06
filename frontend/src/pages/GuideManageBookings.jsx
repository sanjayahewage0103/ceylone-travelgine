import React, { useEffect, useState } from 'react';
import guideBookingService from '../services/guideBookingService';

const STATUS_COLORS = {
  Pending: 'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Declined: 'bg-red-200 text-red-800',
};

function BookingDetailModal({ open, booking, onClose }) {
  if (!open || !booking) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Booking Details</h2>
        <div className="space-y-2">
          <div><b>ID:</b> {booking._id}</div>
          <div><b>Tourist:</b> {booking.user?.name} ({booking.user?.email})</div>
          <div><b>Package:</b> {booking.tourPackage?.package_name}</div>
          <div><b>Date:</b> {booking.date?.slice(0,10)}</div>
          <div><b>Pax:</b> {booking.peopleCount}</div>
          <div><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[booking.status] || ''}`}>{booking.status}</span></div>
          <div><b>Contact:</b> {booking.contactName}, {booking.contactEmail}, {booking.contactPhone}</div>
          <div><b>Payment:</b> {booking.paymentMethod} | <b>Total:</b> LKR {booking.totalPrice?.toLocaleString()}</div>
          <div><b>Created:</b> {booking.createdAt?.slice(0,10)}</div>
        </div>
      </div>
    </div>
  );
}

export default function GuideManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await guideBookingService.getBookings(token, { status, search });
      setBookings(data);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [status, search]);

  const handleStatus = async (id, newStatus) => {
    if (newStatus === 'Approved') {
      // Find the booking being approved
      const bookingToApprove = bookings.find(b => b._id === id);
      if (!bookingToApprove) return;
      // Check for another approved booking on the same date
      const sameDayApproved = bookings.find(b => b._id !== id && b.status === 'Approved' && b.date?.slice(0,10) === bookingToApprove.date?.slice(0,10));
      if (sameDayApproved) {
        alert('You already have an approved trip on this date! Only one trip can be approved per day.');
        return;
      }
    }
    await guideBookingService.updateStatus(id, newStatus, token);
    fetchBookings();
  };

  const handleView = async (id) => {
    const data = await guideBookingService.getDetail(id, token);
    setDetail(data);
    setShowDetail(true);
  };

  // Glassmorphism and background
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `linear-gradient(120deg, rgba(0,212,255,0.13) 0%, rgba(9,121,113,0.10) 100%), url('/Ceylon.png') center/cover no-repeat fixed`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="hidden md:block">
        {/* Sidebar is rendered in layout, or add here if needed */}
      </div>
      <main className="flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl font-bold mb-4 text-cyan-900 drop-shadow">Booking Queue</h1>
          <div className="flex gap-4 mb-4">
            <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-2 py-1">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tourist..." className="border rounded px-2 py-1" />
          </div>
          <div className="rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-xl bg-white/70 border border-white/30">
            <table className="min-w-full text-sm text-left text-cyan-900">
              <thead>
                <tr className="bg-cyan-100/80">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Tourist</th>
                  <th className="px-4 py-2">Package</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Pax</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Stars</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400">No bookings found.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b._id} className="border-b border-cyan-100 hover:bg-cyan-50/60 cursor-pointer">
                    <td className="px-4 py-2" onClick={() => handleView(b._id)}>{b._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-2" onClick={() => handleView(b._id)}>{b.user?.name || b.user?.email || 'Unknown'}</td>
                    <td className="px-4 py-2" onClick={() => handleView(b._id)}>{b.tourPackage?.package_name}</td>
                    <td className="px-4 py-2" onClick={() => handleView(b._id)}>{b.date?.slice(0,10)}</td>
                    <td className="px-4 py-2" onClick={() => handleView(b._id)}>{b.peopleCount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[b.status] || ''}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-2">
                      {b.stars ? (
                        <span className="text-yellow-500 text-lg">{'★'.repeat(Math.round(b.stars))}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {(b.status === 'Pending' || b.status === 'pending') && <>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded" onClick={() => handleStatus(b._id, 'Approved')}>Approve</button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => handleStatus(b._id, 'Declined')}>Decline</button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BookingDetailModal open={showDetail} booking={detail} onClose={() => setShowDetail(false)} />
        </div>
      </main>
    </div>
  );
}
