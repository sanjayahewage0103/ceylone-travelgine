import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserStatsChart = ({ stats }) => {
  if (!stats) return null;
  const data = {
    labels: ['Tourists', 'Vendors', 'Guides', 'Admins'],
    datasets: [
      {
        label: 'User Roles',
        data: [
          stats.totalTourists || 0,
          stats.totalVendors || 0,
          stats.totalGuides || 0,
          stats.totalAdmins || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'User Distribution by Role' },
    },
  };
  return (
    <div className="bg-white rounded shadow p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default UserStatsChart;
