
import React, { useEffect, useState } from 'react';
import UserFilters from '../../components/admin/Users/UserFilters';
import UsersTable from '../../components/admin/Users/UsersTable';
import UserDetailModal from '../../components/admin/Users/UserDetailModal';
import StatCard from '../../components/admin/Dashboard/StatCard';
import PendingApprovalsTable from '../../components/admin/Dashboard/PendingApprovalsTable';
import adminService from '../../services/adminService';

const initialNewUser = {
  fullName: '',
  email: '',
  contact: '',
  nic: '',
  passwordHash: '',
  role: 'tourist',
};


const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUser);
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch all data on mount and when filters change
  useEffect(() => {
    adminService.getAllUsers({ role, status, search }).then(setUsers);
    adminService.getPendingApprovals().then(setPending);
    adminService.getDashboardStats().then(setStats);
  }, [role, status, search]);


  const handleView = user => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleUserAction = async (user, action) => {
    if (!user.profile || !user.profile._id) return;
    try {
      await adminService.approveOrRejectProfile(user.profile._id, user.role, action === 'approve' ? 'approved' : 'rejected');
      setModalOpen(false);
      // Refresh user list
      adminService.getAllUsers({ role, status, search }).then(setUsers);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAddUser = async e => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      await adminService.createUser(newUser);
      setAddModalOpen(false);
      setNewUser(initialNewUser);
      // Refresh user list
      adminService.getAllUsers({ role, status, search }).then(setUsers);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };


  // Add user handler (already implemented)

  // Edit user handler (open modal)
  const handleEdit = user => {
    setEditUser(user);
    setEditModalOpen(true);
  };


  // Save edit handler (now implemented)
  const handleEditSave = async e => {
    e.preventDefault();
    try {
      await adminService.editUser(editUser._id, editUser);
      setEditModalOpen(false);
      setEditUser(null);
      // Refresh user list
      adminService.getAllUsers({ role, status, search }).then(setUsers);
      adminService.getDashboardStats().then(setStats);
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  // Delete user handler
  const handleDelete = async user => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      try {
        await adminService.deleteUser(user._id);
        // Refresh user list
        adminService.getAllUsers({ role, status, search }).then(setUsers);
        adminService.getDashboardStats().then(setStats);
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };


  // Approve/Reject handlers for table
  const handleApprove = async user => {
    await handleUserAction(user, 'approve');
    // Refresh all data
    adminService.getAllUsers({ role, status, search }).then(setUsers);
    adminService.getPendingApprovals().then(setPending);
    adminService.getDashboardStats().then(setStats);
  };
  const handleReject = async user => {
    await handleUserAction(user, 'reject');
    // Refresh all data
    adminService.getAllUsers({ role, status, search }).then(setUsers);
    adminService.getPendingApprovals().then(setPending);
    adminService.getDashboardStats().then(setStats);
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers || 0} />
        <StatCard title="Total Vendors" value={stats.totalVendors || 0} />
        <StatCard title="Total Guides" value={stats.totalGuides || 0} />
        <StatCard title="Total Tourists" value={stats.totalTourists || 0} />
      </div>
      {/* Filters */}
      <UserFilters search={search} setSearch={setSearch} role={role} setRole={setRole} status={status} setStatus={setStatus} />
      {/* All users table */}
      <UsersTable
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      {/* Pending approvals table */}
      <PendingApprovalsTable pendingUsers={pending} onAction={handleApprove} />
      {/* User detail modal */}
      <UserDetailModal user={selectedUser} open={modalOpen} onClose={() => setModalOpen(false)} onAction={handleUserAction} />

      {/* Add User Floating Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 z-50"
        onClick={() => setAddModalOpen(true)}
        title="Add User"
      >
        +
      </button>

      {/* Add User Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white rounded shadow-lg p-6 w-full max-w-md relative" onSubmit={handleAddUser}>
            <button className="absolute top-2 right-2 text-gray-500" type="button" onClick={() => setAddModalOpen(false)}>×</button>
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Contact" value={newUser.contact} onChange={e => setNewUser({ ...newUser, contact: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="NIC" value={newUser.nic} onChange={e => setNewUser({ ...newUser, nic: e.target.value })} />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Password Hash" value={newUser.passwordHash} onChange={e => setNewUser({ ...newUser, passwordHash: e.target.value })} required />
            </div>
            <div className="mb-4">
              <select className="border rounded px-2 py-1 w-full" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required>
                <option value="tourist">Tourist</option>
                <option value="vendor">Vendor</option>
                <option value="guide">Guide</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {addError && <div className="text-red-600 mb-2">{addError}</div>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add User'}</button>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white rounded shadow-lg p-6 w-full max-w-md relative" onSubmit={handleEditSave}>
            <button className="absolute top-2 right-2 text-gray-500" type="button" onClick={() => setEditModalOpen(false)}>×</button>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Full Name" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Email" type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} required />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="Contact" value={editUser.contact || ''} onChange={e => setEditUser({ ...editUser, contact: e.target.value })} />
            </div>
            <div className="mb-2">
              <input className="border rounded px-2 py-1 w-full" placeholder="NIC" value={editUser.nic || ''} onChange={e => setEditUser({ ...editUser, nic: e.target.value })} />
            </div>
            <div className="mb-4">
              <select className="border rounded px-2 py-1 w-full" value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} required>
                <option value="tourist">Tourist</option>
                <option value="vendor">Vendor</option>
                <option value="guide">Guide</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
