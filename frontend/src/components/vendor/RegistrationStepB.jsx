
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// This is the form for Step B: Professional shop details.
const RegistrationStepB = ({ onNext, initialData }) => {
  const [logoName, setLogoName] = useState('');
  const [docName, setDocName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.logo = formData.get('logo');
    data.documentPdf = formData.get('documentPdf');
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-lg text-center text-gray-700">Step 2: Your Shop Details</h3>
      <Input name="shopName" placeholder="Shop Name" defaultValue={initialData.shopName} required />
      <Input name="businessRegNum" placeholder="Business Registration Number" defaultValue={initialData.businessRegNum} required />
      <Input name="location" placeholder="Shop Location (e.g., Kandy)" defaultValue={initialData.location} required />
      <Input name="address" placeholder="Full Street Address" defaultValue={initialData.address} required />
      <textarea name="description" placeholder="Short description of your shop..." defaultValue={initialData.description} className="w-full p-3 border rounded-lg" rows="3"></textarea>
      <div>
        <label className="block text-sm font-medium text-gray-700">Shop Logo</label>
        <input name="logo" type="file" accept="image/*" onChange={e => setLogoName(e.target.files[0]?.name)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        {logoName && <span className="text-xs text-gray-500">{logoName}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Document (PDF)</label>
        <input name="documentPdf" type="file" accept=".pdf" onChange={e => setDocName(e.target.files[0]?.name)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        {docName && <span className="text-xs text-gray-500">{docName}</span>}
      </div>
      <Button type="submit" fullWidth>Next: Legal Agreement</Button>
    </form>
  );
};

export default RegistrationStepB;
