// AdminLoginPage.jsx: Container for admin login logic
import React, { useState } from 'react';
import Login from '../../components/shared/Login';
import authService from '../../services/authService';


const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await authService.login(email, password);
      setSuccess('Login successful!');
      // Optionally, save token or redirect here
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Login onLogin={handleLogin} loading={loading} error={error} />
      {success && <div className="text-green-600 text-center mt-4">{success}</div>}
    </div>
  );
};

export default AdminLoginPage;
