import React, { useState } from 'react';

// --- Reusable UI Components ---
const StatCard = ({ title, value, subValue, icon, colorClass = 'text-cyan-600' }) => ( <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:-translate-y-1"> <div className="flex justify-between items-start"> <div> <p className="text-sm font-medium text-gray-500">{title}</p> <p className={`text-3xl font-bold ${colorClass}`}>{value}</p> {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>} </div> <div className={`p-2 rounded-full bg-opacity-20 ${colorClass.replace('text-', 'bg-')}`}> {icon} </div> </div> </div> );
const RecommendationItem = ({ text }) => ( <li className="flex items-start py-2"> <div className="flex-shrink-0 pt-1"> <svg className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> </div> <p className="ml-3 text-sm text-gray-700 leading-relaxed">{text}</p> </li> );
const InputField = ({ label, name, value, onChange, type = "text", children }) => ( <div> <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label> {children ? ( <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"> {children} </select> ) : ( <input type={type} id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500" /> )} </div> );

// --- Main Dashboard Component ---
function App() {
    const [inputs, setInputs] = useState({
        district: 'Kandy',
        Month: 'december',
        Year: 2025,
        Event_Impact: 'High',
        Season: 'Northeast Monsoon',
        Tripadvisor_Reviews: 180,
        GoogleTrends_Index: 88,
        Avg_Temperature_C: 25,
        Rainfall_mm: 200,
        Event_Count: 2,
        Sunshine_Hours: 190,
    });
    
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const districts = ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"];

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Keep values as strings from form, Flask will handle types
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleGetForecast = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs), // Send the entire inputs state
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }
            setPrediction(data);
        } catch (e) {
            setError(`Failed to fetch forecast: ${e.message}. Please check the Flask server terminal for specific errors.`);
            console.error("API call failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="text-center mb-10"><h1 className="text-4xl font-extrabold text-slate-800">Ceylon TravelGine</h1><p className="text-gray-500 mt-2">AI-Powered Demand Forecasting for Tour Guides</p></header>
                <form onSubmit={handleGetForecast} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Create a Forecast Scenario</h3>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t pt-4">
                        <legend className="text-sm font-semibold text-cyan-700 mb-2">Core Scenario</legend>
                        <InputField label="District" name="district" value={inputs.district} onChange={handleInputChange} type="select">{districts.map(d => <option key={d} value={d}>{d}</option>)}</InputField>
                        {/* <InputField label="Month" name="Month" value={inputs.Month} onChange={handleInputChange} type="select"><option value="december">December</option><option value="january">January</option><option value="february">February</option></InputField> */}
                        
                        <InputField label="Month" name="Month" value={inputs.Month} onChange={handleInputChange} type="select">
                        <option value="january">January</option>
                        <option value="february">February</option>
                        <option value="march">March</option>
                        <option value="april">April</option>
                        <option value="may">May</option>
                        <option value="june">June</option>
                        <option value="july">July</option>
                        <option value="august">August</option>
                        <option value="september">September</option>
                        <option value="october">October</option>
                        <option value="november">November</option>
                        <option value="december">December</option>
                        </InputField>
                        
                        <InputField label="Year" name="Year" value={inputs.Year} onChange={handleInputChange} type="number" />
                        <InputField label="Season" name="Season" value={inputs.Season} onChange={handleInputChange} type="select"><option>Northeast Monsoon</option><option>Southwest Monsoon</option><option>Inter-monsoon</option></InputField>
                    </fieldset>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 border-t pt-4">
                        <legend className="text-sm font-semibold text-cyan-700 mb-2">Contextual Factors</legend>
                        <InputField label="Event Impact" name="Event_Impact" value={inputs.Event_Impact} onChange={handleInputChange} type="select"><option>High</option><option>Medium</option><option>Low</option><option>0</option></InputField>
                        <InputField label="Event Count" name="Event_Count" value={inputs.Event_Count} onChange={handleInputChange} type="number" />
                        <InputField label="Avg Temp (°C)" name="Avg_Temperature_C" value={inputs.Avg_Temperature_C} onChange={handleInputChange} type="number" />
                        <InputField label="Rainfall (mm)" name="Rainfall_mm" value={inputs.Rainfall_mm} onChange={handleInputChange} type="number" />
                    </fieldset>
                    <div className="mt-6 text-right"><button type="submit" disabled={isLoading} className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105">{isLoading ? 'Running AI Model...' : 'Get Forecast'}</button></div>
                </form>
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">{error}</div>}
                {prediction && (
                    <div className="space-y-8" style={{animation: 'fadeIn 0.5s ease-in-out'}}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Predicted Tourist Nights" value={prediction.predicted_tourist_nights.toLocaleString()} subValue={`For ${prediction.district}`} colorClass="text-cyan-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                            <StatCard title="Model Confidence (MAE)" value={`± ${prediction.mae_confidence.toLocaleString()}`} subValue="Mean Absolute Error" colorClass="text-green-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                            <StatCard title="Typical Forecast Error" value={`${prediction.smape_percent_error}%`} subValue="sMAPE on test data" colorClass="text-amber-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"><h3 className="text-xl font-bold text-slate-800">💡 AI Recommendations for {prediction.district}</h3><ul className="mt-4 space-y-2">{prediction.ai_recommendations.map((rec, index) => <RecommendationItem key={index} text={rec} />)}</ul></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;