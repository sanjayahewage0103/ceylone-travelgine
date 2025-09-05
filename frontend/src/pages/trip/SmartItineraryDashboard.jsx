import React, { useState, useEffect } from 'react';

// --- Helper Components ---
const ItineraryCard = ({ itinerary, alternatives }) => (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">Your Personalized Itinerary</h2>
        {Object.entries(itinerary).map(([day, activities]) => {
            const totalTime = activities.reduce((acc, act) => acc + act.travel_time + act.duration, 0);
            const hours = Math.floor(totalTime / 60);
            const minutes = totalTime % 60;

            return (
                <div key={day} className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-600">{day}</h3>
                    <div className="mt-2 pl-4 border-l-4 border-gray-200">
                        {activities.map((item, index) => (
                            <div key={index} className="py-2">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Travel: {item.travel_time} mins, Visit: {item.duration} mins
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-right font-bold text-gray-700 mt-2">
                        Estimated Day Total: {hours} hours, {minutes} minutes
                    </p>
                </div>
            )
        })}
        
        <h3 className="text-xl font-semibold text-blue-600 mt-8 border-t pt-4">You Might Also Like</h3>
        <ul className="list-disc list-inside mt-2">
            {alternatives.map((alt, index) => <li key={index} className="text-gray-700">{alt}</li>)}
        </ul>
    </div>
);

const Loader = () => (
    <div className="flex justify-center items-center mt-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Building your smart itinerary...</p>
    </div>
);

// --- Main App Component ---
export default function App() {
    const [districts, setDistricts] = useState([]);
    const [formData, setFormData] = useState({
        district: 'Kandy',
        interests: 'temples, nature, scenic views',
        budget: 5000,
        days: 1
    });
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch districts on component mount (mocked for this example)
    useEffect(() => {
        // In a real app, you might fetch this from another API endpoint
        const sriLankaDistricts = [
            "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", 
            "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", 
            "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", 
            "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", 
            "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
        ];
        setDistricts(sriLankaDistricts);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setItinerary(null);

        try {
            const response = await fetch('http://127.0.0.1:5001/api/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: parseInt(formData.budget),
                    days: parseInt(formData.days)
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setItinerary(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
                        Smart Tour Plan Engine
                    </h1>
                    <p className="text-center text-gray-500 mt-2">
                        Your personal AI-powered travel planner for Sri Lanka.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700">Destination</label>
                            <select id="district" name="district" value={formData.district} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests</label>
                            <input type="text" id="interests" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., hiking, waterfalls, history" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget per Activity (LKR)</label>
                                <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="days" className="block text-sm font-medium text-gray-700">Number of Days</label>
                                <input type="number" id="days" name="days" value={formData.days} min="1" onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors duration-300">
                            {loading ? 'Generating...' : 'Create My Itinerary'}
                        </button>
                    </form>
                </div>

                {loading && <Loader />}
                {error && <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">{error}</div>}
                {itinerary && <ItineraryCard itinerary={itinerary.itinerary} alternatives={itinerary.alternatives} />}
            </div>
        </div>
    );
}
