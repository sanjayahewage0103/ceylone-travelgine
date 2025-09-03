import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/Dashboard/StatCard';
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
    <div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers || 0} />
        <StatCard title="Total Vendors" value={stats.totalVendors || 0} />
        <StatCard title="Total Guides" value={stats.totalGuides || 0} />
        <StatCard title="Total Tourists" value={stats.totalTourists || 0} />
      </div>
      <PendingApprovalsTable pendingUsers={pending} onAction={() => {}} />
    </div>
  );
};

export default DashboardPage;
