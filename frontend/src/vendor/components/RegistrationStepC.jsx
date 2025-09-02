import React, { useState } from 'react';

function RegistrationStepC({ onSubmit, onBack, loading }) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (agreed) onSubmit({ agreed });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold text-darkgreen">Step 3: Legal Agreement</h3>
      <div className="bg-mixyellow p-2 rounded h-32 overflow-y-scroll text-sm">
        <p>By registering as a vendor, you agree to the terms and conditions of Ceylone Travelgine. Please read the full agreement <a href="/terms.pdf" target="_blank" className="text-orange underline">here</a>.</p>
        <p>All information provided must be accurate and truthful. Your account will be reviewed and approved by an administrator.</p>
      </div>
      <label className="flex items-center">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="ml-2">I agree to the terms and conditions</span>
      </label>
      <div className="flex justify-between mt-2">
        <button type="button" className="text-orange underline" onClick={onBack}>Back</button>
        <button type="submit" className="bg-darkgreen text-white px-4 py-2 rounded" disabled={!agreed || loading}>{loading ? 'Submitting...' : 'Complete Registration'}</button>
      </div>
    </form>
  );
}

export default RegistrationStepC;
