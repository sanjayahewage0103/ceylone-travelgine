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
      <div>
        <h1>Vendor Forecast Dashboard</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>JWT Token:</strong> {jwtToken ? jwtToken : <span style={{color:'red'}}>Not found</span>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Year: <input type="number" value={forecastDate.year} onChange={e => setForecastDate(f => ({ ...f, year: Number(e.target.value) }))} /></label>
        <label style={{ marginLeft: 16 }}>Month: <input type="number" min={1} max={12} value={forecastDate.month} onChange={e => setForecastDate(f => ({ ...f, month: Number(e.target.value) }))} /></label>
      </div>
      <h3>Products</h3>
      {products.map((p, idx) => (
        <div key={idx} style={{ marginBottom: 8, border: '1px solid #ccc', padding: 8 }}>
          <label>Vendor ID: <input type="number" value={p.vendorId} onChange={e => handleProductChange(idx, 'vendorId', Number(e.target.value))} /></label>
          <label style={{ marginLeft: 8 }}>Item ID: <input type="number" value={p.itemId} onChange={e => handleProductChange(idx, 'itemId', Number(e.target.value))} /></label>
          <label style={{ marginLeft: 8 }}>Name: <input type="text" value={p.name} onChange={e => handleProductChange(idx, 'name', e.target.value)} /></label>
          <label style={{ marginLeft: 8 }}>Price: <input type="number" value={p.price} onChange={e => handleProductChange(idx, 'price', Number(e.target.value))} /></label>
          <label style={{ marginLeft: 8 }}>Avg Sales: <input type="number" value={p.avg_sales} onChange={e => handleProductChange(idx, 'avg_sales', Number(e.target.value))} /></label>
          <button style={{ marginLeft: 8 }} onClick={() => removeProduct(idx)}>Remove</button>
        </div>
      ))}
      <button onClick={addProduct} style={{ marginBottom: 16 }}>Add Product</button>
      <br />
      <button onClick={getForecast} disabled={loadingForecast}>
        {loadingForecast ? 'Fetching...' : 'Get December Forecast'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {forecasts && forecasts.productForecasts ? (
        <div style={{ marginTop: 32 }}>
          <h3>💰 Expected Revenue: LKR {forecasts.monthlyForecast?.expectedRevenue?.toLocaleString?.() ?? 'N/A'}</h3>
          <h3>Confidence: {forecasts.monthlyForecast?.confidence ?? 'N/A'}</h3>
          <h3>🔮 Predictions:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Predicted Units</th>
                <th>Expected Revenue</th>
                <th>Demand Level</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.productForecasts.length > 0 ? forecasts.productForecasts.map((p, i) => (
                <tr key={i}>
                  <td>{p.productName ?? 'N/A'}</td>
      <div style={{ marginBottom: 16 }}>
        <label>Vendor:&nbsp;
          <select value={selectedVendor} onChange={e => setSelectedVendor(e.target.value)}>
            <option value="">Select Vendor</option>
            {vendors.map(v => (
              <option key={v._id} value={v._id}>{v.shopName}</option>
            ))}
          </select>
        </label>
      </div>
                  <td>{p.predictedUnits ?? 'N/A'}</td>
                  <td>LKR {p.expectedRevenue?.toLocaleString?.() ?? 'N/A'}</td>
                  <td style={{ color: p.demandLevel === 'High' ? 'red' : p.demandLevel === 'Moderate' ? 'orange' : 'green' }}>
                    {p.demandLevel ?? 'N/A'}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4}>No forecast data available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : forecasts ? (
        <div style={{ marginTop: 32, color: 'red' }}>No forecast results found.</div>
      ) : null}
      </div>
    </>
  );
}

export default VendorForecastingDashboard;