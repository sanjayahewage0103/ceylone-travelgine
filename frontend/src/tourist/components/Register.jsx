import React, { useState } from 'react';
import AuthService from '../services/authService';

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ fullName: '', contact: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await AuthService.register(form);
      setSuccess('Account created! You can now login.');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleRegister}>
      <h2 className="text-2xl font-bold text-primary">Create Account</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <input name="fullName" type="text" className="w-full p-2 border rounded" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
      <input name="contact" type="text" className="w-full p-2 border rounded" placeholder="Contact" value={form.contact} onChange={handleChange} required />
      <input name="email" type="email" className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" className="w-full p-2 border rounded" placeholder="Password" value={form.password} onChange={handleChange} required />
      <input name="confirmPassword" type="password" className="w-full p-2 border rounded" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Create Account</button>
      <div className="text-center mt-2">
        <button type="button" className="text-secondary underline" onClick={onSwitch}>Already have an account? <span className="font-bold">Login</span></button>
      </div>
    </form>
  );
}
