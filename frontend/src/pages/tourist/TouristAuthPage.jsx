import React, { useState } from 'react';
import Register from '../../components/tourist/Register';
import TouristLogin from '../../components/tourist/TouristLogin';
import authService from '../../services/authService';

const TouristAuthPage = () => {
  const [view, setView] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.login(email, password);
      setSuccess('Login successful!');
      // Optionally, redirect or save token here
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        {view === 'register' ? (
          <Register onSwitchToLogin={() => setView('login')} />
        ) : (
          <>
            <TouristLogin
              onLogin={handleLogin}
              loading={loading}
              error={error}
              onSwitchToRegister={() => setView('register')}
            />
            {success && <div className="text-green-600 text-center mt-4">{success}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default TouristAuthPage;
