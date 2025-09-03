import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded shadow p-4 flex items-center">
    {icon && <span className="mr-3 text-2xl">{icon}</span>}
    <div>
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default StatCard;
