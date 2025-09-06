import React, { useState, useEffect } from 'react';
import BusinessNavbar from '../../components/common/BusinessNavbar';

function VendorForecastingDashboard() {
  const [jwtToken, setJwtToken] = useState('');
  const [forecasts, setForecasts] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState('');
  const [forecastDate, setForecastDate] = useState({ year: 2025, month: 12 });
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setJwtToken(token);
    fetch('/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      fetch(`/api/vendors/${selectedVendor}/products`)
        .then(res => res.json())
        .then(data => setAllProducts(Array.isArray(data) ? data : []));
      setProducts([]);
    }
  }, [selectedVendor]);
  const handleProductChange = (idx, field, value) => {
    setProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const addProduct = () => {
    setProducts(prev => [...prev, { vendorId: 1, itemId: '', name: '', price: '', avg_sales: '' }]);
  };

  const removeProduct = idx => {
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const getForecast = async () => {
    setLoadingForecast(true);
    setError('');
    try {
  const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {})
        },
        body: JSON.stringify({ forecast_date: forecastDate, products })
      });
      const data = await response.json();
      setForecasts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <>
      <BusinessNavbar />
      <div className="relative min-h-screen flex bg-gray-100">
        {/* Background image with blur and overlay */}
        <img src={process.env.PUBLIC_URL + '/Ceylon.png'} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" style={{ filter: 'blur(8px) brightness(0.85)' }} />
        <div className="fixed inset-0 bg-white bg-opacity-60 z-0" />
  <main className="flex-1 relative z-10 p-4 md:p-8 flex flex-col items-center">
          <section className="w-full max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-gradient-to-br from-green-50 via-yellow-50 to-white/60 rounded-2xl shadow-xl p-6 md:p-10 border border-green-100">
              <h1 className="text-2xl font-bold mb-6 text-green-700 tracking-tight text-center">Vendor Forecast Dashboard</h1>
              <div className="mb-4 text-sm text-gray-700 text-center">
                <strong>JWT Token:</strong> {jwtToken ? <span className="text-green-600">Found</span> : <span className="text-red-500">Not found</span>}
              </div>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                <label className="font-semibold">Year:
                  <input type="number" value={forecastDate.year} onChange={e => setForecastDate(f => ({ ...f, year: Number(e.target.value) }))} className="ml-2 border rounded px-2 py-1 bg-white/80 w-24" />
                </label>
                <label className="font-semibold">Month:
                  <input type="number" min={1} max={12} value={forecastDate.month} onChange={e => setForecastDate(f => ({ ...f, month: Number(e.target.value) }))} className="ml-2 border rounded px-2 py-1 bg-white/80 w-20" />
                </label>
                <label className="font-semibold">Vendor:
                  <select value={selectedVendor} onChange={e => setSelectedVendor(e.target.value)} className="ml-2 border rounded px-2 py-1 bg-white/80">
                    <option value="">Select Vendor</option>
                    {vendors.map(v => (
                      <option key={v._id} value={v._id}>{v.shopName}</option>
                    ))}
                  </select>
                </label>
              </div>
              <h3 className="text-lg font-bold mb-2 text-green-700">Products</h3>
              <div className="flex flex-col gap-3 mb-4">
                {products.map((p, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center bg-gradient-to-r from-green-50 via-yellow-50 to-white/80 border border-green-100 rounded-lg p-3">
                    <label className="text-xs">Vendor ID:
                      <input type="number" value={p.vendorId} onChange={e => handleProductChange(idx, 'vendorId', Number(e.target.value))} className="ml-1 border rounded px-1 py-0.5 w-16" />
                    </label>
                    <label className="text-xs">Item ID:
                      <input type="number" value={p.itemId} onChange={e => handleProductChange(idx, 'itemId', Number(e.target.value))} className="ml-1 border rounded px-1 py-0.5 w-16" />
                    </label>
                    <label className="text-xs">Name:
                      <input type="text" value={p.name} onChange={e => handleProductChange(idx, 'name', e.target.value)} className="ml-1 border rounded px-1 py-0.5 w-24" />
                    </label>
                    <label className="text-xs">Price:
                      <input type="number" value={p.price} onChange={e => handleProductChange(idx, 'price', Number(e.target.value))} className="ml-1 border rounded px-1 py-0.5 w-20" />
                    </label>
                    <label className="text-xs">Avg Sales:
                      <input type="number" value={p.avg_sales} onChange={e => handleProductChange(idx, 'avg_sales', Number(e.target.value))} className="ml-1 border rounded px-1 py-0.5 w-20" />
                    </label>
                    <button className="ml-2 px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 text-xs" onClick={() => removeProduct(idx)}>Remove</button>
                  </div>
                ))}
              </div>
              <button onClick={addProduct} className="mb-4 px-4 py-2 bg-gradient-to-r from-green-500 via-yellow-400 to-green-400 text-white rounded-lg shadow font-semibold hover:from-green-600 hover:to-yellow-500 transition">Add Product</button>
              <button onClick={getForecast} disabled={loadingForecast} className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 text-green-900 rounded-lg shadow font-semibold hover:from-yellow-500 hover:to-green-600 transition">
                {loadingForecast ? 'Fetching...' : 'Get Forecast'}
              </button>
              {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
              {forecasts && forecasts.productForecasts ? (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-2 text-green-700">4b0 Expected Revenue: <span className="text-green-800">LKR {forecasts.monthlyForecast?.expectedRevenue?.toLocaleString?.() ?? 'N/A'}</span></h3>
                  <h3 className="mb-2 text-yellow-700">Confidence: <span className="text-yellow-800">{forecasts.monthlyForecast?.confidence ?? 'N/A'}</span></h3>
                  <h3 className="mb-2 text-green-700">50e Predictions:</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gradient-to-br from-green-50 via-yellow-50 to-white/80 rounded-xl shadow border border-green-100">
                      <thead>
                        <tr>
                          <th className="px-2 py-1">Product</th>
                          <th className="px-2 py-1">Predicted Units</th>
                          <th className="px-2 py-1">Expected Revenue</th>
                          <th className="px-2 py-1">Demand Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecasts.productForecasts.length > 0 ? forecasts.productForecasts.map((p, i) => (
                          <tr key={i}>
                            <td className="px-2 py-1">{p.productName ?? 'N/A'}</td>
                            <td className="px-2 py-1">{p.predictedUnits ?? 'N/A'}</td>
                            <td className="px-2 py-1">LKR {p.expectedRevenue?.toLocaleString?.() ?? 'N/A'}</td>
                            <td className="px-2 py-1 font-bold" style={{ color: p.demandLevel === 'High' ? '#dc2626' : p.demandLevel === 'Moderate' ? '#f59e42' : '#22c55e' }}>
                              {p.demandLevel ?? 'N/A'}
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="text-center">No forecast data available.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : forecasts ? (
                <div className="mt-8 text-red-500 text-center">No forecast results found.</div>
              ) : null}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default VendorForecastingDashboard;