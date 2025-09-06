
import React, { useEffect, useState, useRef } from 'react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
// Demo chatbot responses
const DEMO_RESPONSES = [
  "Hi! I'm your Smart Tour Chatbot. How can I help you plan your Sri Lankan adventure?",
  "I can suggest places, create itineraries, and answer travel questions!",
  "Try asking: 'What are the top 5 places to visit in Kandy?' or 'Plan a 3-day trip for me.'"
];
import UserFilters from '../../components/admin/Users/UserFilters';
import UsersTable from '../../components/admin/Users/UsersTable';
import UserDetailModal from '../../components/admin/Users/UserDetailModal';
import StatCard from '../../components/admin/Dashboard/StatCard';
import UserStatsChart from '../../components/admin/Dashboard/UserStatsChart';
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

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: DEMO_RESPONSES[0] }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(msgs => [...msgs, { sender: 'user', text: chatInput }]);
    setChatLoading(true);
    setChatInput('');
    setTimeout(() => {
      const botMsg = DEMO_RESPONSES[(chatMessages.length) % DEMO_RESPONSES.length];
      setChatMessages(msgs => [...msgs, { sender: 'bot', text: botMsg }]);
      setChatLoading(false);
    }, 900);
  };

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
      {/* Stat cards and user stats chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers || 0} />
          <StatCard title="Total Vendors" value={stats.totalVendors || 0} />
          <StatCard title="Total Guides" value={stats.totalGuides || 0} />
          <StatCard title="Total Tourists" value={stats.totalTourists || 0} />
        </div>
        <div>
          {/* User role distribution chart */}
          <UserStatsChart stats={stats} />
        </div>
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
        style={{ right: chatOpen ? '6.5rem' : '2rem', transition: 'right 0.2s' }}
      >
        +
      </button>

      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={() => setChatOpen(o => !o)}
        aria-label="Open Chatbot"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <FiMessageCircle size={32} />
      </button>

      {/* Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-teal-500 rounded-t-xl">
            <span className="font-bold text-white text-lg">Smart Tour Chatbot</span>
            <button className="text-white text-2xl" onClick={() => setChatOpen(false)}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50" style={{ minHeight: 220, maxHeight: 320 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${msg.sender === 'bot' ? 'bg-teal-100 text-gray-800' : 'bg-teal-500 text-white'}`}>{msg.text}</div>
              </div>
            ))}
            {chatLoading && <div className="text-xs text-gray-400">Typing...</div>}
            <div ref={chatEndRef} />
          </div>
          <form className="flex items-center border-t border-gray-200 px-2 py-2 bg-white rounded-b-xl" onSubmit={handleChatSend}>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              placeholder="Type your message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatLoading}
              autoFocus
            />
            <button type="submit" className="ml-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 transition-colors" disabled={chatLoading || !chatInput.trim()}>
              <FiSend size={20} />
            </button>
          </form>
        </div>
      )}

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
