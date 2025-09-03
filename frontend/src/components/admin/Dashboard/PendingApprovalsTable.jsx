import React from 'react';

const PendingApprovalsTable = ({ pendingUsers, onAction }) => (
  <div className="bg-white rounded shadow p-4 mt-6">
    <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {pendingUsers.map(user => (
          <tr key={user._id}>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.profile?.status}</td>
            <td>
              <button className="text-green-600 mr-2" onClick={() => onAction(user, 'approve')}>Approve</button>
              <button className="text-red-600" onClick={() => onAction(user, 'reject')}>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PendingApprovalsTable;
