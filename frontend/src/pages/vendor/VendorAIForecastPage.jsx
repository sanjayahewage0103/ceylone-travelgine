import BusinessNavbar from '../../components/common/BusinessNavbar';
import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BarChart2, Lightbulb, BrainCircuit } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- Mock Data (In a real app, this comes from your main database) ---
const VENDORS_AND_PRODUCTS = {
    1: { name: "Laksala", products: [
        { itemId: 1, name: "Wooden Peacock Mask", price: 4500, avg_sales: 100, category: 'Handicrafts' },
        { itemId: 2, name: "Elephant Figurine (Small)", price: 3000, avg_sales: 80, category: 'Handicrafts' },
        { itemId: 3, name: "Traditional 'Geta Beraya' Drum", price: 7500, avg_sales: 20, category: 'Handicrafts' },
        { itemId: 4, name: "Laksha (Lacquerwork) Vase", price: 5500, avg_sales: 22, category: 'Handicrafts' },
        { itemId: 5, name: "Batik Wall Hanging", price: 6000, avg_sales: 90, category: 'Handicrafts' },
    ]},
    2: { name: "Stone 'N' String", products: [
        { itemId: 6, name: "Moonstone Pendant (Silver)", price: 12000, avg_sales: 18, category: 'Gems & Jewellery' },
        { itemId: 7, name: "Garnet Earrings (Studs)", price: 25000, avg_sales: 12, category: 'Gems & Jewellery' },
        { itemId: 8, name: "Silver Filigree Bracelet", price: 18000, avg_sales: 22, category: 'Gems & Jewellery' },
        { itemId: 9, name: "Gemstone Tree of Life", price: 9000, avg_sales: 35, category: 'Gems & Jewellery' },
        { itemId: 10, name: "Amethyst Brooch", price: 35000, avg_sales: 8, category: 'Gems & Jewellery' },
    ]},
    3: { name: "Teaeli", products: [
        { itemId: 11, name: "Pure Ceylon Black Tea Box (100g)", price: 1200, avg_sales: 150, category: 'Food & Spices' },
        { itemId: 12, name: "Green Tea with Jasmine Pearls", price: 1350, avg_sales: 120, category: 'Food & Spices' },
        { itemId: 13, name: "Spiced 'Masala' Chai Mix", price: 1500, avg_sales: 100, category: 'Food & Spices' },
        { itemId: 14, name: "White Tea Silver Tips (50g)", price: 3500, avg_sales: 80, category: 'Food & Spices' },
        { itemId: 15, name: "Earl Grey Infusion", price: 1250, avg_sales: 130, category: 'Food & Spices' },
    ]},
    4: { name: "MA's Kitchen", products: [
        { itemId: 16, name: "MA's Kitchen Roasted Curry Powder", price: 550, avg_sales: 200, category: 'Food & Spices' },
        { itemId: 17, name: "Goraka (Garcinia) Paste Jar", price: 600, avg_sales: 180, category: 'Food & Spices' },
        { itemId: 18, name: "Kithul Treacle Bottle (350ml)", price: 900, avg_sales: 160, category: 'Food & Spices' },
        { itemId: 19, name: "Herbal 'Kola Kanda' Porridge Mix", price: 750, avg_sales: 140, category: 'Food & Spices' },
        { itemId: 20, name: "Dehydrated Jackfruit Pack (100g)", price: 950, avg_sales: 110, category: 'Food & Spices' },
    ]},
    5: { name: "Barefoot", products: [
        { itemId: 21, name: "Handloom Cotton Saree", price: 8000, avg_sales: 30, category: 'Handicrafts' },
        { itemId: 22, name: "Handloom Cotton Sarong", price: 3500, avg_sales: 50, category: 'Handicrafts' },
        { itemId: 23, name: "Colorful Cushion Cover", price: 2500, avg_sales: 75, category: 'Handicrafts' },
        { itemId: 24, name: "Stuffed Animal (Elephant)", price: 3200, avg_sales: 60, category: 'Handicrafts' },
        { itemId: 25, name: "Woven Reed Basket", price: 2200, avg_sales: 45, category: 'Handicrafts' },
    ]},
    6: { name: "Spa Ceylon", products: [
        { itemId: 26, name: "King Coconut Hair Oil", price: 2500, avg_sales: 90, category: 'Wellness & Ayurveda' },
        { itemId: 27, name: "Sandalwood & Vetiver Face Scrub", price: 3200, avg_sales: 80, category: 'Wellness & Ayurveda' },
        { itemId: 28, name: "Ayurvedic Herbal Balm", price: 1800, avg_sales: 120, category: 'Wellness & Ayurveda' },
        { itemId: 29, name: "Lemongrass Essential Oil (10ml)", price: 2800, avg_sales: 70, category: 'Wellness & Ayurveda' },
        { itemId: 30, name: "Herbal Body Soap (Neem & Turmeric)", price: 950, avg_sales: 150, category: 'Wellness & Ayurveda' },
    ]},
    7: { name: "Prasanna Gem Centre", products: [
        { itemId: 31, name: "Blue Sapphire Ring (0.5 Carat)", price: 150000, avg_sales: 5, category: 'Gems & Jewellery' },
        { itemId: 32, name: "Star Sapphire Cufflinks", price: 85000, avg_sales: 7, category: 'Gems & Jewellery' },
        { itemId: 33, name: "Padparadscha Sapphire Necklace", price: 250000, avg_sales: 3, category: 'Gems & Jewellery' },
        { itemId: 34, name: "Cat's Eye Chrysoberyl (Loose)", price: 95000, avg_sales: 10, category: 'Gems & Jewellery' },
        { itemId: 35, name: "Polished Rose Quartz Geode", price: 7000, avg_sales: 30, category: 'Gems & Jewellery' },
    ]},
    8: { name: "Dumbara Ratā Kalāle", products: [
        { itemId: 36, name: "Dumbara Wall Mat", price: 9500, avg_sales: 12, category: 'Handicrafts' },
        { itemId: 37, name: "Hana Fiber Coasters (Set of 4)", price: 1500, avg_sales: 50, category: 'Handicrafts' },
        { itemId: 38, name: "Palm Leaf Box", price: 2800, avg_sales: 40, category: 'Handicrafts' },
        { itemId: 39, name: "Dumbara Design Table Runner", price: 4500, avg_sales: 20, category: 'Handicrafts' },
        { itemId: 40, name: "Hana Fiber Hat", price: 3800, avg_sales: 30, category: 'Handicrafts' },
    ]},
    9: { name: "Araliya Batiks", products: [
        { itemId: 41, name: "Batik Ladies Kaftan", price: 5500, avg_sales: 35, category: 'Handicrafts' },
        { itemId: 42, name: "Batik Gents Shirt", price: 4800, avg_sales: 40, category: 'Handicrafts' },
        { itemId: 43, name: "Batik Tablecloth", price: 7200, avg_sales: 18, category: 'Handicrafts' },
        { itemId: 44, name: "Batik Silk Scarf", price: 3000, avg_sales: 60, category: 'Handicrafts' },
        { itemId: 45, name: "Batik Cushion Cover Set", price: 3500, avg_sales: 50, category: 'Handicrafts' },
    ]},
    10: { name: "Ceylon Spice Corridor", products: [
        { itemId: 46, name: "Ceylon 'True' Cinnamon Sticks (100g)", price: 850, avg_sales: 300, category: 'Food & Spices' },
        { itemId: 47, name: "Cardamom Pods (50g)", price: 950, avg_sales: 250, category: 'Food & Spices' },
        { itemId: 48, name: "Whole Black Pepper (100g)", price: 700, avg_sales: 280, category: 'Food & Spices' },
        { itemId: 49, name: "Turmeric Powder (100g)", price: 650, avg_sales: 260, category: 'Food & Spices' },
        { itemId: 50, name: "Ceylon Cloves (50g)", price: 650, avg_sales: 220, category: 'Food & Spices' },
    ]},
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
                products: selectedProducts.map(p => ({ ...p, vendorId: Number(selectedVendor.value), itemId: p.value })),
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
            datasets: [
                {
                    label: 'Revenue',
                    data: Object.values(categoryRevenue),
                    backgroundColor: [
                        '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#facc15', '#4ade80', '#818cf8', '#f59e42'
                    ]
                }
            ]
        };
    }, [forecastData, selectedVendor]);

    return (
        <>
            <BusinessNavbar />
            <div className="flex min-h-screen">
                <div className="flex-1 p-4 md:p-8 bg-gray-100 font-sans">
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
                        <main className="flex-1 bg-gray-50 p-8">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
        </>
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
                    return <tr key={p.productName} className="border-b"><td className="px-4 py-2 font-medium">{p.productName}</td><td className="px-4 py-2 text-right font-bold">{p.predictedUnits}</td><td className={`px-4 py-2 text-center font-semibold ${color}`}>{p.demandLevel}</td></tr>;
                })}
            </tbody>
        </table>
    </div>
);

export default VendorAIForecastPage;

