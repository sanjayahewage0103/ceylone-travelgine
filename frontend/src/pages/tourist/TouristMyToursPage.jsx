import React, { useEffect, useState } from 'react';

const TouristMyToursPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                <th className="px-4 py-2 text-left">Tour Package</th>
                <th className="px-4 py-2 text-left">Guide</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Guests</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-b">
                  <td className="px-4 py-2">
                    <div className="font-semibold">{booking.tourPackage?.package_name || '—'}</div>
                    <div className="text-xs text-gray-400">{booking.tourPackage?.location}</div>
                  </td>
                  <td className="px-4 py-2">
                    {booking.tourPackage?.guide?.fullName || booking.tourPackage?.guideName || '—'}
                  </td>
                  <td className="px-4 py-2">{booking.date ? new Date(booking.date).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2">{booking.guests || booking.pax || ''}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === 'paid' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{booking.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {/* Add actions like view, cancel, etc. */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TouristMyToursPage;
