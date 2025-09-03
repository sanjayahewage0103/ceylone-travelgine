
import React, { useState } from 'react';
import Button from '../ui/Button';

// Reusable legal agreement step
const RegistrationStepC = ({ onFinalSubmit, loading }) => {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed) {
      onFinalSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Legal Agreement</h2>
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-gray-700 text-sm">
          By registering, you agree to our terms and conditions. Please confirm you have read and accept the legal agreement to proceed.
        </p>
      </div>
      <label className="flex items-center">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mr-2" />
        <span className="text-sm">I agree to the terms and conditions</span>
      </label>
      <Button type="submit" fullWidth disabled={!agreed || loading}>
        {loading ? 'Submitting...' : 'Complete Registration'}
      </Button>
    </form>
  );
};

export default RegistrationStepC;
