import React from 'react';

function RegistrationStepA({ form, setForm, next }) {
  return (
    <form onSubmit={e => { e.preventDefault(); next(); }}>
      <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      <input type="text" placeholder="Contact" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} required />
      <input type="text" placeholder="NIC" value={form.nic} onChange={e => setForm(f => ({ ...f, nic: e.target.value }))} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
      <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
      <button type="submit">Next</button>
    </form>
  );
}

export default RegistrationStepA;
