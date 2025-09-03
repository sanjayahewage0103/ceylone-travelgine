import React from 'react';

const UserFilters = ({ search, setSearch, role, setRole, status, setStatus }) => (
  <div className="flex gap-4 mb-4">
    <input
      type="text"
      placeholder="Search by name or email"
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="border rounded px-2 py-1"
    />
    <select value={role} onChange={e => setRole(e.target.value)} className="border rounded px-2 py-1">
      <option value="">All Roles</option>
      <option value="tourist">Tourist</option>
      <option value="vendor">Vendor</option>
      <option value="guide">Guide</option>
      <option value="admin">Admin</option>
    </select>
    <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-2 py-1">
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
);

export default UserFilters;
