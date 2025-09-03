import React from 'react';

const UserDetailModal = ({ user, open, onClose, onAction }) => {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-2">User Details</h2>
        <div className="mb-2"><b>Name:</b> {user.fullName}</div>
        <div className="mb-2"><b>Email:</b> {user.email}</div>
        <div className="mb-2"><b>Role:</b> {user.role}</div>
        <div className="mb-2"><b>Status:</b> {user.profile?.status || '-'}</div>
        {/* Add more fields as needed */}
        <div className="flex gap-2 mt-4">
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => onAction(user, 'approve')}>Approve</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onAction(user, 'reject')}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
