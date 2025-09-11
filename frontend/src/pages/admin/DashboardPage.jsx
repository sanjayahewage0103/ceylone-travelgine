


import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/Dashboard/StatCard';
import UserStatsChart from '../../components/admin/Dashboard/UserStatsChart';
import PendingApprovalsTable from '../../components/admin/Dashboard/PendingApprovalsTable';
import adminService from '../../services/adminService';

const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats);
    adminService.getPendingApprovals().then(setPending);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers || 0} />
        <StatCard title="Total Vendors" value={stats.totalVendors || 0} />
        <StatCard title="Total Guides" value={stats.totalGuides || 0} />
        <StatCard title="Pending Approvals" value={pending.length || 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">User Role Distribution</h2>
          <UserStatsChart stats={stats} />
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
          <PendingApprovalsTable pendingUsers={pending} onAction={() => {}} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
