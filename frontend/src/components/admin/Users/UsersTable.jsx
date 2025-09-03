import React from 'react';

const UsersTable = ({ users, onView }) => (
  <div className="bg-white rounded shadow p-4">
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
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.profile?.status || '-'}</td>
            <td>
              <button className="text-blue-600" onClick={() => onView(user)}>View Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
