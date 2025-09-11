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
      setPrediction(null);
      setError('');
    } else {
      setError('Please select a valid image file (JPEG, PNG, etc.).');
      setImageFile(null);
      setPreviewUrl('');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-gray-900 text-white font-sans p-4">
      <div className="w-full max-w-3xl bg-gray-800/90 rounded-3xl shadow-2xl p-0 md:p-10 space-y-8 border border-cyan-700 relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 py-8 px-4 md:px-0">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-300 drop-shadow-lg mb-2 tracking-tight">
              Ceylon Lence <span className="text-cyan-500">AI</span>
            </h1>
            <p className="text-lg text-gray-300 mb-4 max-w-lg">
              Instantly identify Sri Lanka's most iconic landmarks from your photos. Powered by AI, built for explorers.
            </p>
            <ul className="text-sm text-cyan-200/80 mb-2 space-y-1">
              <li>• Works with any photo of a Sri Lankan landmark</li>
              <li>• Fast, private, and free to use</li>
              <li>• Get confidence scores and landmark info</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-44 h-44 md:w-56 md:h-56 bg-gradient-to-br from-cyan-500/30 to-blue-700/30 rounded-full flex items-center justify-center shadow-lg border-4 border-cyan-400/30">
              {previewUrl ? (
                <img src={previewUrl} alt="Selected landmark" className="w-full h-full object-cover rounded-full border-4 border-cyan-400 shadow-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center text-cyan-200">
                  <UploadIcon />
                  <span className="mt-2 text-sm">Upload a landmark photo</span>
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
          </div>
        </div>

        {/* Upload & Predict Buttons */}
        <div className="flex flex-col md:flex-row gap-4 px-4 md:px-0">
          <button
            onClick={triggerFileSelect}
            className="w-full md:w-1/2 bg-gradient-to-r from-cyan-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            {imageFile ? 'Change Image' : 'Choose Image'}
          </button>
          <button
            onClick={handlePredict}
            disabled={!imageFile || isLoading}
            className="w-full md:w-1/2 bg-cyan-400 hover:bg-cyan-300 disabled:bg-gray-500 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Analyzing...' : 'Identify Landmark'}
          </button>
        </div>

        {/* Tips Section */}
        <div className="bg-cyan-900/60 border-l-4 border-cyan-400 rounded-xl p-4 mx-2 md:mx-0">
          <h3 className="font-semibold text-cyan-200 mb-1">Tips for Best Results:</h3>
          <ul className="text-cyan-100 text-sm list-disc list-inside space-y-1">
            <li>Use clear, well-lit photos of the landmark.</li>
            <li>Try to avoid selfies or group photos.</li>
            <li>Supported formats: JPG, PNG, WEBP.</li>
          </ul>
        </div>

        {/* Results Section */}
        <div className="pt-2 min-h-[6rem] px-2 md:px-0">
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-cyan-400"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-900/60 text-red-200 border border-red-700 p-4 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {prediction && (
            <div className="bg-gradient-to-br from-green-900/60 to-cyan-900/60 text-green-200 border border-green-700 p-6 rounded-2xl text-center animate-fade-in shadow-lg">
              <p className="text-lg text-cyan-200">I'm quite sure this is:</p>
              <h2 className="text-4xl font-extrabold text-white mt-2 drop-shadow-lg">{prediction.prediction}</h2>
              <p className="text-md text-cyan-300 mt-3">Confidence: <span className="font-bold">{prediction.confidence}</span></p>
              {prediction.info && (
                <div className="mt-4 text-cyan-100 text-sm bg-cyan-800/40 rounded-lg p-3 border border-cyan-700">
                  {prediction.info}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Animation for fade-in */}
        <style>
          {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}
        </style>
      </div>
    </div>
  );
}
