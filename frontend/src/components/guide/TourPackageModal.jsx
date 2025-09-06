
import React, { useState, useEffect } from 'react';
import tourPackageService from '../../services/tourPackageService';


const TourPackageModal = ({ pkg, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...pkg });
  const [images, setImages] = useState(pkg.images || []);
  const [newImages, setNewImages] = useState([]); // File objects
  const [status, setStatus] = useState(pkg.status || 'active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // Normalize itinerary to always be an array of {dayTitle, stops}
  function normalizeItinerary(itin) {
    if (!itin) return [];
    if (Array.isArray(itin)) {
      // If array of objects with dayTitle and stops, return as is
      if (itin.every(d => typeof d === 'object' && d !== null && Array.isArray(d.stops))) return itin;
      // If array of strings (old format), wrap as one day
      if (itin.every(d => typeof d === 'string')) return [{ dayTitle: '', stops: itin }];
    }
    // If object, try to convert to array
    if (typeof itin === 'object') {
      // If has dayTitle/stops keys, wrap in array
      if ('dayTitle' in itin && 'stops' in itin) return [itin];
      // If keys are day numbers, convert to array
      const arr = Object.values(itin);
      if (arr.every(d => typeof d === 'object' && Array.isArray(d.stops))) return arr;
    }
    return [];
  }

  // Fetch full package data by ID when modal opens
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    tourPackageService.getTourPackageById(pkg._id)
      .then(data => {
        if (!mounted) return;
        setForm(f => ({
          ...f,
          ...data,
          itinerary: normalizeItinerary(data.itinerary),
        }));
        setImages(data.images || []);
        setStatus(data.status || 'active');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, [pkg._id]);

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = e => {
    setNewImages(Array.from(e.target.files));
  };

  const handleRemoveImage = idx => {
    setImages(imgs => imgs.filter((_, i) => i !== idx));
    if (imgIdx >= images.length - 1 && imgIdx > 0) setImgIdx(imgIdx - 1);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        status,
        images: [...images, ...newImages],
      };
      await tourPackageService.updateTourPackage(pkg._id, payload, localStorage.getItem('token'));
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative md:p-8">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 md:px-0">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh] md:p-8">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4">Edit Tour Package</h2>
        {/* Image slider */}
        <div className="mb-4">
          {images.length > 0 && (
            <div className="relative w-full h-56 mb-2">
              {(() => {
                let imgSrc = images[imgIdx];
                if (imgSrc) {
                  if (imgSrc.startsWith('/uploads/')) {
                    if (import.meta.env.DEV) {
                      imgSrc = `http://localhost:5000${imgSrc}`;
                    }
                  } else if (imgSrc.startsWith('uploads/')) {
                    imgSrc = '/' + imgSrc;
                    if (import.meta.env.DEV) {
                      imgSrc = `http://localhost:5000${imgSrc}`;
                    }
                  } else if (!imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
                    imgSrc = `/uploads/${imgSrc}`;
                    if (import.meta.env.DEV) {
                      imgSrc = `http://localhost:5000${imgSrc}`;
                    }
                  }
                }
                return <img src={imgSrc} alt="Tour" className="object-cover w-full h-full rounded" />;
              })()}
              {images.length > 1 && (
                <>
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1" onClick={() => setImgIdx(i => Math.max(i - 1, 0))} disabled={imgIdx === 0}>&lt;</button>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1" onClick={() => setImgIdx(i => Math.min(i + 1, images.length - 1))} disabled={imgIdx === images.length - 1}>&gt;</button>
                </>
              )}
              <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-red-500" onClick={() => handleRemoveImage(imgIdx)}>🗑</button>
            </div>
          )}
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
          {newImages.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">{newImages.map((file, idx) => <span key={idx} className="text-xs bg-cyan-100 px-2 py-1 rounded">{file.name}</span>)}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input name="package_name" value={form.package_name} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tour Type</label>
            <select name="tourType" value={form.tourType || ''} onChange={handleField} className="w-full border p-2 rounded">
              <option value="">Select Tour Type</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Beach">Beach</option>
              <option value="Historical">Historical</option>
              <option value="Family">Family</option>
              <option value="Luxury">Luxury</option>
              <option value="Budget">Budget</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Tour Category</label>
            <select name="tourCategory" value={form.tourCategory || ''} onChange={handleField} className="w-full border p-2 rounded">
              <option value="">Select Tour Category</option>
              <option value="Group">Group</option>
              <option value="Private">Private</option>
              <option value="Custom">Custom</option>
              <option value="Day Tour">Day Tour</option>
              <option value="Multi-Day">Multi-Day</option>
              <option value="Special Interest">Special Interest</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border p-2 rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input name="duration" value={form.duration} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Group Size</label>
            <input name="max_group_size" value={form.max_group_size} onChange={handleField} className="w-full border p-2 rounded" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (LKR)</label>
            <input name="price_lkr" value={form.price_lkr} onChange={handleField} className="w-full border p-2 rounded" type="number" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Inclusions</label>
            <input name="inclusions" value={form.inclusions} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Exclusions</label>
            <input name="exclusions" value={form.exclusions} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Languages</label>
            <input name="languages" value={form.languages} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Availability</label>
            <input name="availability" value={form.availability} onChange={handleField} className="w-full border p-2 rounded" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">Itinerary</label>
            <div className="space-y-4">
              {(form.itinerary || []).map((day, dayIdx) => (
                <div key={dayIdx} className="border rounded p-3 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                    <input
                      className="font-semibold text-base border-b border-gray-300 flex-1 bg-transparent focus:outline-none"
                      value={day.dayTitle || ''}
                      placeholder={`Day ${dayIdx + 1} Title`}
                      onChange={e => {
                        const newItin = [...form.itinerary];
                        newItin[dayIdx].dayTitle = e.target.value;
                        setForm(f => ({ ...f, itinerary: newItin }));
                      }}
                    />
                    <button
                      className="text-red-500 text-lg px-2"
                      title="Remove Day"
                      onClick={() => {
                        const newItin = [...form.itinerary];
                        newItin.splice(dayIdx, 1);
                        setForm(f => ({ ...f, itinerary: newItin }));
                      }}
                    >🗑</button>
                  </div>
                  <div className="space-y-2">
                    {(day.stops || []).map((stop, stopIdx) => (
                      <div key={stopIdx} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          className="border-b border-gray-300 flex-1 bg-transparent focus:outline-none"
                          value={stop.stop || ''}
                          placeholder={`Stop ${stopIdx + 1} Name`}
                          onChange={e => {
                            const newItin = [...form.itinerary];
                            newItin[dayIdx].stops[stopIdx] = { ...newItin[dayIdx].stops[stopIdx], stop: e.target.value };
                            setForm(f => ({ ...f, itinerary: newItin }));
                          }}
                        />
                        <input
                          className="border-b border-gray-200 w-24 bg-transparent focus:outline-none text-xs"
                          value={stop.time || ''}
                          placeholder="Time (opt)"
                          onChange={e => {
                            const newItin = [...form.itinerary];
                            newItin[dayIdx].stops[stopIdx] = { ...newItin[dayIdx].stops[stopIdx], time: e.target.value };
                            setForm(f => ({ ...f, itinerary: newItin }));
                          }}
                        />
                        <button
                          className="text-red-400 px-1"
                          title="Remove Stop"
                          onClick={() => {
                            const newItin = [...form.itinerary];
                            newItin[dayIdx].stops.splice(stopIdx, 1);
                            setForm(f => ({ ...f, itinerary: newItin }));
                          }}
                        >✖</button>
                      </div>
                    ))}
                    <button
                      className="text-xs text-blue-600 hover:underline mt-1"
                      onClick={() => {
                        const newItin = [...form.itinerary];
                        if (!newItin[dayIdx].stops) newItin[dayIdx].stops = [];
                        newItin[dayIdx].stops.push({ stop: '', time: '' });
                        setForm(f => ({ ...f, itinerary: newItin }));
                      }}
                    >+ Add Stop</button>
                  </div>
                </div>
              ))}
              <button
                className="text-sm text-green-700 hover:underline"
                onClick={e => {
                  e.preventDefault();
                  const newItin = [...(form.itinerary || [])];
                  newItin.push({ dayTitle: '', stops: [''] });
                  setForm(f => ({ ...f, itinerary: newItin }));
                }}
              >+ Add Day</button>
            </div>
            <div className="text-xs text-gray-500 mt-1">Edit days and stops easily. Add/remove as needed.</div>
          </div>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
          <button className="bg-gray-200 px-4 py-2 rounded w-full sm:w-auto" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

export default TourPackageModal;
