import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import authService from '../../services/authService';

const GuideLogin = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        if (result.user && result.user.role === 'guide' && result.user.id) {
          localStorage.setItem('guideId', result.user.id);
        }
        console.log('JWT token:', result.token);
      }
      navigate('/guide/profile');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center text-cyan-700 mb-2">Guide Login</h2>
      {error && <div className="text-red-600 text-center font-medium">{error}</div>}
      <Input name="email" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Button type="submit" fullWidth disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
      <div className="text-center mt-4">
        <span className="text-gray-700">Don't have an account? </span>
        <Button variant="text" onClick={onSwitchToRegister} className="text-cyan-700 underline font-semibold">Register here</Button>
      </div>
      <div className="text-center mt-2">
        <Link to="/" className="text-cyan-700 underline font-semibold">Go to Home</Link>
      </div>
    </form>
  );
};

export default GuideLogin;
