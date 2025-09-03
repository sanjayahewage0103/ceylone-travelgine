import React, { useState } from 'react';
import Button from '../ui/Button';

const VendorLogin = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // TODO: Implement vendor login logic (call authService.login)
    setLoading(false);
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
