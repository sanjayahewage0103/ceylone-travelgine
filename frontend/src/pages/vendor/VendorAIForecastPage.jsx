import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BarChart2, Lightbulb, BrainCircuit } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- Mock Data (In a real app, this comes from your main database) ---
const VENDORS_AND_PRODUCTS = {
    1: { name: "Laksala", products: [
        { itemId: 1, name: "Wooden Peacock Mask", price: 4500, avg_sales: 100, category: 'Handicrafts' }, { itemId: 2, name: "Elephant Figurine (Small)", price: 3000, avg_sales: 80, category: 'Handicrafts' }, { itemId: 3, name: "Traditional 'Geta Beraya' Drum", price: 7500, avg_sales: 20, category: 'Handicrafts' }, { itemId: 4, name: "Laksha (Lacquerwork) Vase", price: 5500, avg_sales: 22, category: 'Handicrafts' }, { itemId: 5, name: "Batik Wall Hanging", price: 6000, avg_sales: 90, category: 'Handicrafts' },
    ]},
    5: { name: "Barefoot", products: [
        { itemId: 21, name: "Handloom Cotton Saree", price: 8000, avg_sales: 30, category: 'Handicrafts' }, { itemId: 22, name: "Handloom Cotton Sarong", price: 3500, avg_sales: 50, category: 'Handicrafts' },
    ]},
    // ... add all other vendors and their products
};

const VendorAIForecastPage = () => {
    const [selectedVendor, setSelectedVendor] = useState({ value: 1, label: 'Laksala' });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [forecastDate, setForecastDate] = useState('2025-12');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState('');

    const productOptions = useMemo(() => {
        if (!selectedVendor) return [];
        return VENDORS_AND_PRODUCTS[selectedVendor.value].products.map(p => ({
            value: p.itemId, label: p.name, ...p
        }));
    }, [selectedVendor]);

    const handleForecast = async () => {
        if (selectedProducts.length === 0) {
            setError('Please select at least one product to forecast.');
            return;
        }
        setError(''); setLoading(true); setForecastData(null);

        try {
            const [year, month] = forecastDate.split('-').map(Number);
            const requestBody = {
                products: selectedProducts.map(p => ({ ...p, vendorId: selectedVendor.value, itemId: p.value })),
                forecast_date: { year, month }
            };

            const response = await fetch('http://127.0.0.1:5000/forecast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error('Failed to fetch forecast from AI service.');
            
            const data = await response.json();
            setForecastData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const chartData = useMemo(() => {
        if (!forecastData) return { labels: [], datasets: [] };
        const categoryRevenue = forecastData.productForecasts.reduce((acc, p) => {
            const productDetails = VENDORS_AND_PRODUCTS[selectedVendor.value].products.find(prod => prod.name === p.productName);
            if (productDetails) {
                acc[productDetails.category] = (acc[productDetails.category] || 0) + p.expectedRevenue;
            }
            return acc;
        }, {});
        
        return {
            labels: Object.keys(categoryRevenue),
            datasets: [{ data: Object.values(categoryRevenue), backgroundColor: ['#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6'] }]
        };
    }, [forecastData, selectedVendor]);

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">AI Demand Forecast</h1>
                    <p className="text-gray-500">Insights for {selectedVendor?.label || 'your store'}</p>
                </header>

                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Store</label>
                            <Select options={Object.keys(VENDORS_AND_PRODUCTS).map(id => ({ value: id, label: VENDORS_AND_PRODUCTS[id].name }))} defaultValue={selectedVendor} onChange={setSelectedVendor} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Products to Forecast</label>
                            <Select options={productOptions} isMulti closeMenuOnSelect={false} onChange={setSelectedProducts} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Forecast for Month</label>
                            <input type="month" value={forecastDate} onChange={e => setForecastDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg h-[38px]" />
                        </div>
                    </div>
                     <button onClick={handleForecast} disabled={loading} className="mt-6 w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center">
                        <BarChart2 className="mr-2 h-5 w-5" /> {loading ? 'Running AI Models...' : 'Generate Forecast'}
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">{error}</div>}
                {loading && <div className="text-center p-12">Loading...</div>}

                {forecastData && (
                    <main>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <KpiCard title="Projected Revenue" value={`LKR ${forecastData.monthlyForecast.expectedRevenue.toLocaleString()}`} />
                            <KpiCard title="Est. Tourists (District)" value={forecastData.touristInsights.touristsInDistrict.split(' ')[0]} />
                            <KpiCard title="Top Demand Driver" value="Tourism" />
                        </section>
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products Forecast</h3>
                                    <ProductTable products={forecastData.productForecasts} />
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Lightbulb className="text-yellow-500 mr-2" />Inventory Recommendations</h3>
                                    <ul className="space-y-3 text-sm text-gray-700">{forecastData.inventoryRecommendations.map((rec, i) => <li key={i} className="flex items-start"><span className="mr-2">📌</span><span>{rec}</span></li>)}</ul>
                                </div>
                            </div>
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><BrainCircuit className="text-blue-500 mr-2" />AI Generated Insights</h3>
                                    <ul className="space-y-3 text-sm text-gray-700">{forecastData.aiGeneratedInsights.map((ins, i) => <li key={i}>- {ins}</li>)}</ul>
                                </div>
                                 <div className="bg-white p-6 rounded-xl shadow border">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue by Category</h3>
                                    <Doughnut data={chartData} />
                                </div>
                            </div>
                        </section>
                    </main>
                )}
            </div>
        </div>
    );
};

// --- Child Components ---
const KpiCard = ({ title, value }) => (<div className="bg-white p-6 rounded-xl shadow border"><p className="text-sm text-gray-500">{title}</p><p className="text-3xl font-bold text-gray-800">{value}</p></div>);
const ProductTable = ({ products }) => (
    <div className="overflow-auto max-h-96">
        <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left font-semibold">Product</th><th className="px-4 py-2 text-right font-semibold">Predicted Units</th><th className="px-4 py-2 text-center font-semibold">Demand</th></tr></thead>
            <tbody>
                {products.map(p => {
                    const color = p.demandLevel === 'High' ? 'text-red-600' : p.demandLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600';
                    return <tr key={p.productName} className="border-b"><td className="px-4 py-2 font-medium">{p.productName}</td><td className="px-4 py-2 text-right font-bold">{p.predictedUnits}</td><td className="px-4 py-2 text-center font-semibold ${color}">${p.demandLevel}</td></tr>;
                })}
            </tbody>
        </table>
    </div>
);

export default VendorAIForecastPage;

