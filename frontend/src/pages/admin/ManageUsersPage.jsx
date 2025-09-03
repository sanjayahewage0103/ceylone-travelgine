import React, { useEffect, useState } from 'react';
import UserFilters from '../../components/admin/Users/UserFilters';
import UsersTable from '../../components/admin/Users/UsersTable';
import UserDetailModal from '../../components/admin/Users/UserDetailModal';
import adminService from '../../services/adminService';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    adminService.getAllUsers({ role, status, search }).then(setUsers);
  }, [role, status, search]);

  const handleView = user => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <div>
      <UserFilters search={search} setSearch={setSearch} role={role} setRole={setRole} status={status} setStatus={setStatus} />
      <UsersTable users={users} onView={handleView} />
      <UserDetailModal user={selectedUser} open={modalOpen} onClose={() => setModalOpen(false)} onAction={() => {}} />
    </div>
  );
};

export default ManageUsersPage;
