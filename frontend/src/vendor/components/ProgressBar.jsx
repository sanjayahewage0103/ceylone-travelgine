import React from 'react';

function ProgressBar({ step }) {
  const steps = ['Personal', 'Professional', 'Agreement'];
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= idx ? 'bg-primary text-white border-primary' : 'bg-gray-200 text-gray-400 border-gray-300'} transition-all duration-300`}>{idx + 1}</div>
          <span className={`mt-2 text-xs font-medium ${step >= idx ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
        </div>
      )).reduce((prev, curr, idx) => [prev, <div key={idx} className="w-8 h-1 bg-gray-300 mx-1 rounded-full" />, curr])}
    </div>
  );
}

export default ProgressBar;
