import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tourPackageService from '../services/tourPackageService';

function ImageSlider({ images = [] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return <div className="bg-gray-200 h-56 w-full rounded" />;
  return (
    <div className="relative w-full h-56 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
      <img src={images[idx]} alt="Tour" className="object-cover w-full h-full" />
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1">‹</button>
          <button onClick={() => setIdx((idx + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full px-2 py-1">›</button>
        </>
      )}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, i) => (
          <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
        ))}
      </div>
    </div>
  );
}

function ItineraryAccordion({ itinerary = [] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y rounded border bg-white">
      {itinerary.map((day, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left">
            Day {day.day}: {day.stops[0]?.stop || ''}
            <span>{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && (
            <div className="px-6 pb-4 text-gray-700">
              <ul className="list-disc ml-5">
                {day.stops.map((s, j) => (
                  <li key={j}>{s.time ? <span className="font-medium">{s.time}:</span> : null} {s.stop}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TourPackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPkg() {
      setLoading(true);
      try {
        const data = await tourPackageService.getTourPackageById(id);
        setPkg(data);
      } catch {
        setPkg(null);
      }
      setLoading(false);
    }
    fetchPkg();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!pkg) return <div className="text-center py-20 text-red-500">Tour not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top: Images, Title, Price, Book Button */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/2">
          <ImageSlider images={pkg.images} />
        </div>
        <div className="md:w-1/2 flex flex-col gap-3 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 mb-2">{pkg.package_name}</h1>
            <div className="text-gray-600 mb-2">{pkg.description}</div>
            <div className="mb-2">
              <span className="font-semibold text-lg text-green-700">LKR {pkg.price_lkr?.toLocaleString()}</span>
              <span className="ml-2 text-sm text-gray-500">per person</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">Duration: {pkg.duration?.replace('-', ' ')}</div>
            <div className="text-sm text-gray-500 mb-2">Category: {pkg.tourCategory} | Type: {pkg.tourType}</div>
            <div className="text-sm text-gray-500 mb-2">Max Group Size: {pkg.max_group_size}</div>
            <div className="text-sm text-gray-500 mb-2">Languages: {pkg.languages?.join(', ')}</div>
            <div className="text-sm text-gray-500 mb-2">Inclusions: {pkg.inclusions?.join(', ')}</div>
          </div>
          <button className="bg-blue-700 text-white px-6 py-2 rounded text-lg font-semibold mt-4 w-full md:w-auto">Book Tour</button>
        </div>
      </div>
      {/* Quick Itinerary */}
      {pkg.itinerary?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Quick Itinerary</h2>
          <div className="flex flex-wrap gap-2">
            {pkg.itinerary.map((day, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Day {day.day}: {day.stops[0]?.stop}</span>
            ))}
          </div>
        </div>
      )}
      {/* Detailed Itinerary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Detailed Itinerary</h2>
        <ItineraryAccordion itinerary={pkg.itinerary} />
      </div>
    </div>
  );
}
