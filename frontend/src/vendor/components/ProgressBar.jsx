import React from 'react';

function ProgressBar({ step }) {
  const percent = step === 1 ? 33 : step === 2 ? 66 : 100;
  return (
    <div className="w-full bg-mixyellow rounded-full h-2 mb-4">
      <div className="bg-darkgreen h-2 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  );
}

export default ProgressBar;
