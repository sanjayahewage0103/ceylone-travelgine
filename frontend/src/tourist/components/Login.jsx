import React, { useState, useContext } from 'react';
import AuthService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await AuthService.login(email, password);
      setAuth({ user: res.user, token: res.token });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold text-primary">Tourist Login</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input type="email" className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Login</button>
      <div className="text-center mt-2">
        <button type="button" className="text-secondary underline" onClick={onSwitch}>Don't have an account? <span className="font-bold">Create one</span></button>
      </div>
    </form>
  );
}
