
// RegistrationStepA: Presentational component for vendor core account creation
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegistrationStepA = ({ onNext }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Pass data up to parent
    onNext({ fullName, email, contact, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Create Vendor Account</h2>
      <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Contact Number" type="text" value={contact} onChange={e => setContact(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      <Button type="submit">Next</Button>
    </form>
  );
};

export default RegistrationStepA;
