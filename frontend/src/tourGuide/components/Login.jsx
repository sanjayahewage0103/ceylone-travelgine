import React, { useState } from 'react';
import AuthService from '../services/authService';


function Login({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await AuthService.login(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-6 bg-white rounded-xl shadow-lg p-8 border border-gray-200 animate-fade-in"
      style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
      onSubmit={handleLogin}
    >
      <div className="flex flex-col items-center mb-4">
        <img src="https://img.icons8.com/fluency/96/map-pin.png" alt="Guide" className="mb-2" />
        <h2 className="text-3xl font-extrabold text-primary mb-1 tracking-tight">Tour Guide Login</h2>
        <p className="text-gray-500 text-sm">Access your guide dashboard</p>
      </div>
      {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md"
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm mr-2"></span>
        ) : null}
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="text-center mt-4">
        <button
          type="button"
          className="text-secondary hover:text-primary underline font-medium transition-colors duration-200"
          onClick={onSwitch}
        >
          Don't have an account? <span className="font-bold">Join Now</span>
        </button>
      </div>
    </form>
  );
}

export default Login;
