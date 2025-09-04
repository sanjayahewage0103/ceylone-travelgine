import React, { useEffect, useState } from 'react';
import VendorSidebar from '../../components/vendor/VendorSidebar';
import orderService from '../../services/orderService';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const val = obj[key] || 'Other';
    acc[val] = acc[val] || [];
    acc[val].push(obj);
    return acc;
  }, {});
}

const VendorSalesDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    orderService.getVendorOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  // Analytics calculations
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const filteredOrders = orders.filter(order => {
    const orderMonth = order.createdAt?.slice(0, 7);
    const matchMonth = monthFilter ? orderMonth === monthFilter : true;
    const matchCategory = categoryFilter ? order.items.some(i => i.category === categoryFilter) : true;
    return matchMonth && matchCategory;
  });
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Monthly revenue data
  const monthlyGroups = groupBy(orders, o => o.createdAt?.slice(0, 7));
  const monthlyLabels = Object.keys(monthlyGroups).sort();
  const monthlyRevenue = monthlyLabels.map(m => monthlyGroups[m].reduce((sum, o) => sum + o.totalAmount, 0));

  // Product-wise revenue
  const productGroups = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productGroups[item.name] = (productGroups[item.name] || 0) + item.price * item.quantity;
    });
  });
  const productLabels = Object.keys(productGroups);
  const productRevenue = productLabels.map(p => productGroups[p]);

  // Category-wise revenue
  const categoryGroups = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      categoryGroups[item.category] = (categoryGroups[item.category] || 0) + item.price * item.quantity;
    });
  });
  const categoryLabels = Object.keys(categoryGroups);
  const categoryRevenue = categoryLabels.map(c => categoryGroups[c]);

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-6">Sales Analytics Dashboard</h1>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-lg font-semibold text-gray-600 mb-2">Total Revenue</div>
                <div className="text-3xl font-bold text-green-700">LKR {totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-lg font-semibold text-gray-600 mb-2">Orders This Month</div>
                <div className="text-3xl font-bold text-blue-700">{filteredOrders.length}</div>
              </div>
              <div className="bg-white rounded shadow p-6 text-center">
                <div className="text-lg font-semibold text-gray-600 mb-2">Average Order Value</div>
                <div className="text-3xl font-bold text-purple-700">LKR {filteredOrders.length ? Math.round(totalRevenue / filteredOrders.length).toLocaleString() : 0}</div>
              </div>
            </div>
            <div className="mb-8 flex gap-4 items-center">
              <label className="font-semibold">Month:</label>
              <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="border rounded px-2 py-1">
                <option value="">All</option>
                {monthlyLabels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="font-semibold ml-6">Category:</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded px-2 py-1">
                <option value="">All</option>
                {categoryLabels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded shadow p-6">
                <div className="font-bold mb-2">Monthly Revenue</div>
                <Bar data={{
                  labels: monthlyLabels,
                  datasets: [{ label: 'Revenue', data: monthlyRevenue, backgroundColor: '#38bdf8' }],
                }} options={{ plugins: { legend: { display: false } } }} />
              </div>
              <div className="bg-white rounded shadow p-6">
                <div className="font-bold mb-2">Product-wise Revenue</div>
                <Pie data={{
                  labels: productLabels,
                  datasets: [{ data: productRevenue, backgroundColor: [
                    '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#facc15', '#4ade80', '#818cf8', '#f59e42'
                  ] }],
                }} />
              </div>
            </div>
            <div className="bg-white rounded shadow p-6 mb-8">
              <div className="font-bold mb-2">Category-wise Revenue</div>
              <Bar data={{
                labels: categoryLabels,
                datasets: [{ label: 'Revenue', data: categoryRevenue, backgroundColor: '#34d399' }],
              }} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-bold mb-2">Recent Orders</div>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Order ID</th>
                    <th className="px-2 py-1">Date</th>
                    <th className="px-2 py-1">Total</th>
                    <th className="px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 10).map(order => (
                    <tr key={order.orderId} className="border-b">
                      <td className="px-2 py-1 font-mono">{order.orderId}</td>
                      <td className="px-2 py-1">{order.createdAt?.slice(0, 10)}</td>
                      <td className="px-2 py-1 font-semibold">LKR {order.totalAmount.toLocaleString()}</td>
                      <td className="px-2 py-1">{order.orderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VendorSalesDashboardPage;
