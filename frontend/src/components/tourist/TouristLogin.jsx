import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TouristLogin = ({ onLogin, loading, error, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Tourist Login</h2>
        <p className="text-gray-600">Sign in to explore Sri Lanka.</p>
      </div>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="font-semibold text-teal-600 hover:text-teal-800">
          Register Here
        </button>
      </p>
    </form>
  );
};

export default TouristLogin;
