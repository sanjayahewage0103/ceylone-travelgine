import React from 'react';


const UsersTable = ({ users, onView, onEdit, onDelete, onApprove, onReject }) => (
  <div className="bg-white rounded shadow p-4">
    <table className="w-full text-left">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.profile?.status || '-'}</td>
            <td className="flex gap-2 flex-wrap">
              <button className="text-blue-600 underline" onClick={() => onView(user)}>View</button>
              <button className="text-yellow-600 underline" onClick={() => onEdit && onEdit(user)}>Edit</button>
              <button className="text-red-600 underline" onClick={() => onDelete && onDelete(user)}>Delete</button>
              {user.profile?.status === 'pending' && (
                <>
                  <button className="text-green-600 underline" onClick={() => onApprove && onApprove(user)}>Approve</button>
                  <button className="text-red-500 underline" onClick={() => onReject && onReject(user)}>Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
