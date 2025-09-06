import React, { useState } from 'react';
import tourPackageService from '../../services/tourPackageService';

const DURATION_OPTIONS = [
  'half-day', 'full-day', 'multi-day'
];

const TOUR_TYPE_OPTIONS = [
  'Adventure', 'Cultural', 'Wildlife', 'Beach', 'Historical', 'Family', 'Luxury', 'Budget', 'Other'
];
const TOUR_CATEGORY_OPTIONS = [
  'Group', 'Private', 'Custom', 'Day Tour', 'Multi-Day', 'Special Interest', 'Other'
];

const initialState = {
  package_name: '',
  description: '',
  duration: '',
  max_group_size: '',
  price_lkr: '',
  itinerary: [],
  inclusions: [],
  exclusions: '',
  availability: [],
  languages: [],
  images: [],
  tourType: '',
  tourCategory: '',
};

const CreateTourPackageModal = ({ isOpen, onClose, guideId, token, onCreated }) => {
  const [form, setForm] = useState(initialState);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // For inclusions/languages
  const [inclusionInput, setInclusionInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  // For itinerary
    const [itinerary, setItinerary] = useState([]); // [{ day: 1, stops: [{ stop, time }] }]
  // For availability
  const [availability, setAvailability] = useState([]); // array of date strings

  if (!isOpen) return null;

  // Responsive modal style
  const modalClass = "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh] md:p-8";

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Duration dropdown: when changed, update itinerary stops (default 1 for half/full, 3 for multi)
    const handleDurationChange = e => {
      const value = e.target.value;
      setForm(f => ({ ...f, duration: value }));
      let numDays = 1;
      if (value === 'multi-day') numDays = 3;
      setItinerary(Array.from({ length: numDays }, (_, i) => ({ day: i + 1, stops: [{ stop: '', time: '' }] })));
    };

    // Itinerary handlers for days and stops
    const handleDayChange = (dayIdx, value) => {
      setItinerary(arr => arr.map((item, i) => i === dayIdx ? { ...item, day: value } : item));
    };
    const handleStopChange = (dayIdx, stopIdx, field, value) => {
      setItinerary(arr => arr.map((day, i) =>
        i === dayIdx
          ? { ...day, stops: day.stops.map((stop, j) => j === stopIdx ? { ...stop, [field]: value } : stop) }
          : day
      ));
    };
    const handleAddDay = () => {
      setItinerary(arr => arr.length < 10 ? [...arr, { day: arr.length + 1, stops: [{ stop: '', time: '' }] }] : arr);
    };
    const handleRemoveDay = dayIdx => {
      setItinerary(arr => arr.filter((_, i) => i !== dayIdx).map((d, i) => ({ ...d, day: i + 1 })));
    };
    const handleAddStopToDay = dayIdx => {
      setItinerary(arr => arr.map((day, i) =>
        i === dayIdx && day.stops.length < 10
          ? { ...day, stops: [...day.stops, { stop: '', time: '' }] }
          : day
      ));
    };
    const handleRemoveStopFromDay = (dayIdx, stopIdx) => {
      setItinerary(arr => arr.map((day, i) =>
        i === dayIdx
          ? { ...day, stops: day.stops.filter((_, j) => j !== stopIdx) }
          : day
      ));
    };


  // Add inclusion
  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      setForm(f => ({ ...f, inclusions: [...f.inclusions, inclusionInput.trim()] }));
      setInclusionInput('');
    }
  };
  const handleRemoveInclusion = idx => {
    setForm(f => ({ ...f, inclusions: f.inclusions.filter((_, i) => i !== idx) }));
  };

  // Add language
  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      setForm(f => ({ ...f, languages: [...f.languages, languageInput.trim()] }));
      setLanguageInput('');
    }
  };
  const handleRemoveLanguage = idx => {
    setForm(f => ({ ...f, languages: f.languages.filter((_, i) => i !== idx) }));
  };

  // Itinerary handlers
  const handleItineraryChange = (idx, field, value) => {
    setItinerary(arr => arr.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  // Add/Remove stops for multi-day
  const handleAddStop = () => {
    setItinerary(arr => [...arr, { stop: '', time: '' }]);
  };
  const handleRemoveStop = idx => {
    setItinerary(arr => arr.filter((_, i) => i !== idx));
  };


  const handleImageChange = e => {
    setImageFiles(Array.from(e.target.files));
  };

  // Availability: add date
  const handleAddAvailability = date => {
    if (date && !availability.includes(date)) {
      setAvailability(arr => [...arr, date]);
    }
  };
  const handleRemoveAvailability = idx => {
    setAvailability(arr => arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        guide_id: guideId,
        images: imageFiles,
        itinerary: itinerary,
        availability: availability,
      };
      await tourPackageService.createTourPackage(payload, token);
      setForm(initialState);
      setImageFiles([]);
      setItinerary([]);
      setAvailability([]);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 md:px-0">
      <div className={modalClass}>
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4">Create Tour Package</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="package_name" value={form.package_name} onChange={handleChange} placeholder="Package Name" className="w-full border p-2 rounded" required />
            <input name="price_lkr" value={form.price_lkr} onChange={handleChange} placeholder="Price (LKR)" type="number" className="w-full border p-2 rounded" required />
            <select name="tourType" value={form.tourType} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">Select Tour Type</option>
              {TOUR_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select name="tourCategory" value={form.tourCategory} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">Select Tour Category</option>
              {TOUR_CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select name="duration" value={form.duration} onChange={handleDurationChange} className="w-full border p-2 rounded" required>
              <option value="">Select Duration</option>
              {DURATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input name="max_group_size" value={form.max_group_size} onChange={handleChange} placeholder="Max Group Size" type="number" className="w-full border p-2 rounded" required />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" required />

          {/* Dynamic Itinerary fields: days and stops */}
          {itinerary.length > 0 && <div>
            <div className="font-semibold mb-1">Itinerary (up to 10 days, 10 stops per day)</div>
            {itinerary.map((day, dayIdx) => (
              <div key={dayIdx} className="mb-4 border rounded p-2 bg-gray-50 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row items-center mb-2 gap-2">
                  <div className="font-medium flex-1">Day {day.day}</div>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => handleRemoveDay(dayIdx)} className="text-red-500 text-lg ml-2">× Remove Day</button>
                  )}
                </div>
                {day.stops.map((stop, stopIdx) => (
                  <div key={stopIdx} className="flex flex-col sm:flex-row gap-2 items-end mb-2">
                    <input
                      type="text"
                      placeholder="Stop/Location"
                      value={stop.stop}
                      onChange={e => handleStopChange(dayIdx, stopIdx, 'stop', e.target.value)}
                      className="border p-1 rounded flex-1"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Time (optional)"
                      value={stop.time}
                      onChange={e => handleStopChange(dayIdx, stopIdx, 'time', e.target.value)}
                      className="border p-1 rounded flex-1"
                    />
                    {day.stops.length > 1 && (
                      <button type="button" onClick={() => handleRemoveStopFromDay(dayIdx, stopIdx)} className="text-red-500 text-lg ml-2">×</button>
                    )}
                  </div>
                ))}
                {day.stops.length < 10 && (
                  <button type="button" onClick={() => handleAddStopToDay(dayIdx)} className="bg-cyan-700 text-white px-2 py-1 rounded mt-1">+ Add Stop</button>
                )}
                {day.stops.length >= 10 && (
                  <div className="text-xs text-gray-500 mt-1">Maximum 10 stops for this day.</div>
                )}
              </div>
            ))}
            {itinerary.length < 10 && (
              <button type="button" onClick={handleAddDay} className="bg-cyan-700 text-white px-2 py-1 rounded mt-1">+ Add Day</button>
            )}
            {itinerary.length >= 10 && (
              <div className="text-xs text-gray-500 mt-1">Maximum 10 days reached.</div>
            )}
          </div>}

          {/* Inclusions add-one-by-one */}
          <div>
            <div className="font-semibold mb-1">Inclusions</div>
            <div className="flex flex-col sm:flex-row gap-2 mb-1">
              <input
                type="text"
                value={inclusionInput}
                onChange={e => setInclusionInput(e.target.value)}
                placeholder="Add inclusion"
                className="border p-1 rounded flex-1"
              />
              <button type="button" onClick={handleAddInclusion} className="bg-cyan-700 text-white px-2 rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.inclusions.map((inc, idx) => (
                <span key={idx} className="bg-cyan-100 px-2 py-1 rounded text-sm flex items-center">
                  {inc} <button type="button" onClick={() => handleRemoveInclusion(idx)} className="ml-1 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <input name="exclusions" value={form.exclusions} onChange={handleChange} placeholder="Exclusions" className="w-full border p-2 rounded" />

          {/* Availability: calendar date picker (simple input type=date, add to list) */}
          <div>
            <div className="font-semibold mb-1">Availability Dates</div>
            <div className="flex flex-col sm:flex-row gap-2 mb-1">
              <input type="date" id="avail-date" className="border p-1 rounded" />
              <button type="button" onClick={() => {
                const date = document.getElementById('avail-date').value;
                handleAddAvailability(date);
                document.getElementById('avail-date').value = '';
              }} className="bg-cyan-700 text-white px-2 rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.map((date, idx) => (
                <span key={idx} className="bg-cyan-100 px-2 py-1 rounded text-sm flex items-center">
                  {date} <button type="button" onClick={() => handleRemoveAvailability(idx)} className="ml-1 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages add-one-by-one */}
          <div>
            <div className="font-semibold mb-1">Languages</div>
            <div className="flex flex-col sm:flex-row gap-2 mb-1">
              <input
                type="text"
                value={languageInput}
                onChange={e => setLanguageInput(e.target.value)}
                placeholder="Add language"
                className="border p-1 rounded flex-1"
              />
              <button type="button" onClick={handleAddLanguage} className="bg-cyan-700 text-white px-2 rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.languages.map((lang, idx) => (
                <span key={idx} className="bg-cyan-100 px-2 py-1 rounded text-sm flex items-center">
                  {lang} <button type="button" onClick={() => handleRemoveLanguage(idx)} className="ml-1 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
          {error && <div className="text-red-500">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2" disabled={loading}>{loading ? 'Creating...' : 'Create Package'}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTourPackageModal;
