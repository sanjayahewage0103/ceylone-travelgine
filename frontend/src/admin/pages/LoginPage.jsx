import React from 'react';
import Login from '../components/Login';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <Login />
      </div>
    </div>
  );
}
