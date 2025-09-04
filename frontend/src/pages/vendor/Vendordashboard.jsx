import React, { useState } from 'react';

function VendorDashboard() {
  const [forecasts, setForecasts] = useState(null);

  const getForecast = async () => {
    const vendorProducts = [
      { vendorId: 1, itemId: 8, name: "Wooden Peacock Mask", price: 4500, avg_sales: 65 },
      { vendorId: 1, itemId: 9, name: "Batik Wall Hanging", price: 6000, avg_sales: 45 }
    ];

    try {
      const response = await fetch('http://localhost:5000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forecast_date: { year: 2025, month: 12 },
          products: vendorProducts
        })
      });

      const data = await response.json();
      setForecasts(data);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  return (
    <div>
      <h1>Vendor Forecast Dashboard</h1>
      <button onClick={getForecast}>Get December Forecast</button>

      {forecasts && (
        <div>
          <h3>💰 Expected Revenue: LKR {forecasts.monthlyForecast.expectedRevenue.toLocaleString()}</h3>
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
              {forecasts.productForecasts.map((p, i) => (
                <tr key={i}>
                  <td>{p.productName}</td>
                  <td>{p.predictedUnits}</td>
                  <td>LKR {p.expectedRevenue.toLocaleString()}</td>
                  <td style={{ color: p.demandLevel === 'High' ? 'red' : 'orange' }}>
                    {p.demandLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;