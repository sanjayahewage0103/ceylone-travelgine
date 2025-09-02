import React from 'react';

function PendingApproval({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-darkgreen mb-4">Registration Submitted!</h2>
      <p className="mb-6 text-center text-mixyellow">Your registration is pending approval. You will be notified once your account is activated.</p>
      <button className="bg-orange text-white px-4 py-2 rounded" onClick={onBack}>Back to Login</button>
    </div>
  );
}

export default PendingApproval;
