import React, { useState, useRef } from 'react';

// SVG Icon for upload placeholder
const UploadIcon = () => (
  <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Main App Component
export default function LandmarkLens() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handles the change when a user selects a file
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null); // Reset previous prediction
      setError(''); // Reset previous error
    } else {
      setError('Please select a valid image file (JPEG, PNG, etc.).');
      setImageFile(null);
      setPreviewUrl('');
    }
  };

  // Triggers the hidden file input
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handles the prediction logic
  const handlePredict = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Replace with your Flask API endpoint if it's different
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'An error occurred with the API.');
      }

      const data = await response.json();
      setPrediction(data);

    } catch (err) {
      setError(err.message || 'Failed to connect to the prediction service. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">LandmarkLens AI</h1>
          <p className="text-gray-400 mt-2">Discover Sri Lanka's beautiful landmarks from your photos.</p>
        </div>

        {/* Image Upload and Preview */}
        <div 
          className="w-full h-80 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-900/50 cursor-pointer hover:border-cyan-400 transition-colors"
          onClick={triggerFileSelect}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Selected landmark" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="text-center">
              <UploadIcon />
              <p className="mt-2 text-gray-400">Click to upload an image</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={triggerFileSelect}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            {imageFile ? 'Change Image' : 'Choose Image'}
          </button>
          <button
            onClick={handlePredict}
            disabled={!imageFile || isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-500 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Analyzing...' : 'Identify Landmark'}
          </button>
        </div>

        {/* Results Section */}
        <div className="pt-4 min-h-[6rem]">
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 text-red-300 border border-red-700 p-4 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {prediction && (
            <div className="bg-green-900/50 text-green-200 border border-green-700 p-6 rounded-lg text-center animate-fade-in">
              <p className="text-lg text-gray-400">I'm quite sure this is:</p>
              <h2 className="text-3xl font-bold text-white mt-2">{prediction.prediction}</h2>
              <p className="text-md text-cyan-400 mt-3">Confidence: {prediction.confidence}</p>
            </div>
          )}
        </div>

      </div>
       {/* Add a simple fade-in animation */}
       <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
}
