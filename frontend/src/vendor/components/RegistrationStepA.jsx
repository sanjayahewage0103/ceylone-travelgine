import React, { useState } from 'react';

function RegistrationStepA({ onNext, onBack }) {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleNext = e => {
    e.preventDefault();
    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    onNext(fields);
  };

  return (
    <form className="space-y-4" onSubmit={handleNext}>
      <h3 className="text-xl font-bold text-darkgreen">Step 1: Personal Details</h3>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input name="fullName" type="text" className="w-full p-2 border rounded" placeholder="Full Name" value={fields.fullName} onChange={handleChange} required />
      <input name="email" type="email" className="w-full p-2 border rounded" placeholder="Email" value={fields.email} onChange={handleChange} required />
      <input name="contact" type="text" className="w-full p-2 border rounded" placeholder="Contact" value={fields.contact} onChange={handleChange} required />
      <input name="password" type="password" className="w-full p-2 border rounded" placeholder="Password" value={fields.password} onChange={handleChange} required />
      <input name="confirmPassword" type="password" className="w-full p-2 border rounded" placeholder="Confirm Password" value={fields.confirmPassword} onChange={handleChange} required />
      <div className="flex justify-between mt-2">
        <button type="button" className="text-orange underline" onClick={onBack}>Back to Login</button>
        <button type="submit" className="bg-darkgreen text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}

export default RegistrationStepA;
