import React, { useState } from 'react';
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');

export default function BookTourModal({ open, onClose, onBook, pkg, user }) {
  const [date, setDate] = useState(today);
  const [peopleCount, setPeopleCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const totalPrice = (pkg?.price_lkr || 0) * peopleCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onBook({
        date,
        peopleCount,
        paymentMethod,
        contactName,
        contactEmail,
        contactPhone,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Book Tour: {pkg?.package_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Date</label>
            <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Number of People</label>
            <input type="number" min={1} max={pkg?.max_group_size || 20} value={peopleCount} onChange={e => setPeopleCount(Number(e.target.value))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Contact Name</label>
            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Contact Email</label>
            <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium mb-1">Contact Phone</label>
            <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="font-semibold text-lg text-green-700">Total: LKR {totalPrice.toLocaleString()}</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-semibold" disabled={loading}>{loading ? 'Booking...' : 'Pay & Book'}</button>
        </form>
      </div>
    </div>
  );
}
