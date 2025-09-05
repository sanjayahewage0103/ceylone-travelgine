import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TouristOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/orders/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/user/${order.orderId || order._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      await fetchOrders();
    } catch (err) {
      alert('Cancel failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Details</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2 font-mono">{order._id}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-700' : order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-4 py-2">
                    {order.items && order.items.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.name} x {item.quantity}</li>
                        ))}
                      </ul>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                  <td className="px-4 py-2">
                    {/* Example actions: View, Cancel, etc. */}
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => navigate(`/tourist/my-orders/${order.orderId || order._id}`)}>View</button>
                    {order.orderStatus === 'Pending' && (
                      <button className="text-red-600 hover:underline" onClick={() => handleCancel(order)}>Cancel</button>
                    )}
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

export default TouristOrdersPage;
