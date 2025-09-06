import React, { useEffect, useState } from 'react';
import PendingProductsTable from '../../components/admin/Dashboard/PendingProductsTable';
// import StatCard from '../../components/admin/Dashboard/StatCard';
// import ProductStatsChart from '../../components/admin/Dashboard/ProductStatsChart';

const ManageProductsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <PendingProductsTable />
    </div>
  );
};

export default ManageProductsPage;
