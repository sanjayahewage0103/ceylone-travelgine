// Login.jsx: Presentational login form
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Login = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
    </form>
  );
};

export default Login;
