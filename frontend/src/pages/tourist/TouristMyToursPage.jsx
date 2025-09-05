
import React, { useEffect, useState } from 'react';

const BookingDetailModal = ({ booking, open, onClose }) => {
  if (!open || !booking) return null;
  const pkg = booking.tourPackage || {};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Booking Details</h2>
        <div className="mb-2"><b>Tour Package:</b> {pkg.package_name}</div>
        <div className="mb-2"><b>Guide Name:</b> {pkg.guide_id?.fullName || pkg.guideName || '—'}</div>
        <div className="mb-2"><b>Booking Date:</b> {booking.date ? new Date(booking.date).toLocaleDateString() : ''}</div>
        <div className="mb-2"><b>Guests:</b> {booking.peopleCount}</div>
        <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === 'paid' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{booking.status}</span></div>
        <div className="mb-2"><b>Total Price:</b> LKR {booking.totalPrice?.toLocaleString()}</div>
        <div className="mb-2"><b>Payment Method:</b> {booking.paymentMethod}</div>
        <div className="mb-2"><b>Contact Name:</b> {booking.contactName}</div>
        <div className="mb-2"><b>Contact Email:</b> {booking.contactEmail}</div>
        <div className="mb-2"><b>Contact Phone:</b> {booking.contactPhone}</div>
        <div className="mb-2"><b>Created At:</b> {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : ''}</div>
        {pkg.description && <div className="mb-2"><b>Description:</b> {pkg.description}</div>}
        {pkg.images && pkg.images.length > 0 && (
          <div className="mb-2"><b>Images:</b>
            <div className="flex gap-2 mt-1 flex-wrap">
              {pkg.images.map((img, idx) => (
                <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Tour" className="h-20 w-28 object-cover rounded" />
              ))}
            </div>
          </div>
        )}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div className="mb-2">
            <b>Itinerary:</b>
            <ul className="list-disc pl-5">
              {pkg.itinerary.map((day, idx) => (
                <li key={idx}><b>Day {day.day}:</b> {day.stops.map(s => s.stop).join(', ')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const TouristMyToursPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch('/api/bookings/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : (data.bookings || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Tour Bookings</h2>
      {loading ? (
        <div>Loading your tours...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : bookings.length === 0 ? (
        <div>No tour bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-2 text-left">Booking Date</th>
                <th className="px-4 py-2 text-left">Guide Name</th>
                <th className="px-4 py-2 text-left">Tour Package</th>
                <th className="px-4 py-2 text-left">Guests</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-b">
                  <td className="px-4 py-2">{booking.date ? new Date(booking.date).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2">{booking.tourPackage?.guide_id?.fullName || booking.tourPackage?.guideName || '—'}</td>
                  <td className="px-4 py-2">{booking.tourPackage?.package_name || '—'}</td>
                  <td className="px-4 py-2">{booking.peopleCount}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === 'paid' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{booking.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline" onClick={() => setSelectedBooking(booking)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BookingDetailModal booking={selectedBooking} open={!!selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};

export default TouristMyToursPage;
