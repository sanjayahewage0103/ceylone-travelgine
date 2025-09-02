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
    <form className="space-y-6" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold text-primary">Tour Guide Login</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input type="email" className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      <div className="text-center mt-2">
        <button type="button" className="text-secondary underline" onClick={onSwitch}>Don't have an account? Join Now</button>
      </div>
    </form>
  );
}

export default Login;
