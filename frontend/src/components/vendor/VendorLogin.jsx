
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import authService from '../../services/authService';


const VendorLogin = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.token) {
        // Save token for authenticated requests
        localStorage.setItem('token', result.token);
      } else {
        setError('No token received. Login failed.');
        setLoading(false);
        return;
      }
      if (result.user && result.user.role === 'vendor' && result.user.status === 'approved') {
        navigate('/vendor/dashboard');
      } else if (result.user && result.user.role === 'vendor' && result.user.status !== 'approved') {
        setError('Your vendor account is not approved yet.');
      } else {
        setError('Invalid vendor credentials.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-center">Vendor Login</h2>
      <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
      {error && <div className="text-red-600 text-sm font-medium text-center">{error}</div>}
      <Button type="submit" fullWidth disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
      <Button type="button" fullWidth onClick={onSwitchToRegister} className="mt-2">Register as Vendor</Button>
    </form>
  );
};

export default VendorLogin;
