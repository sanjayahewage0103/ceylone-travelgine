import React from 'react';

function ProgressBar({ step }) {
  const steps = ['Personal', 'Professional', 'Agreement'];
  return (
    <div className="flex space-x-2 mb-4">
      {steps.map((label, idx) => (
        <div key={label} className={`flex-1 h-2 rounded ${step > idx ? 'bg-primary' : 'bg-gray-300'}`}></div>
      ))}
    </div>
  );
}

export default ProgressBar;
