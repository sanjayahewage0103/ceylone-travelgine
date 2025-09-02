import React, { useState } from 'react';

function RegistrationStepB({ onNext, onBack }) {
  const [fields, setFields] = useState({
    shopName: '',
    businessRegNum: '',
    location: '',
    address: '',
    description: '',
    logoUrl: null,
    documentPdfUrl: null,
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFields({
      ...fields,
      [name]: files ? files[0] : value,
    });
  };

  const handleNext = e => {
    e.preventDefault();
    onNext({ shopDetails: fields });
  };

  return (
    <form className="space-y-4" onSubmit={handleNext}>
      <h3 className="text-xl font-bold text-darkgreen">Step 2: Shop Details</h3>
      <input name="shopName" type="text" className="w-full p-2 border rounded" placeholder="Shop Name" value={fields.shopName} onChange={handleChange} required />
      <input name="businessRegNum" type="text" className="w-full p-2 border rounded" placeholder="Business Registration Number" value={fields.businessRegNum} onChange={handleChange} required />
      <input name="location" type="text" className="w-full p-2 border rounded" placeholder="Location" value={fields.location} onChange={handleChange} required />
      <input name="address" type="text" className="w-full p-2 border rounded" placeholder="Address" value={fields.address} onChange={handleChange} required />
      <textarea name="description" className="w-full p-2 border rounded" placeholder="Description" value={fields.description} onChange={handleChange} />
      <label className="block">Logo Image:
        <input name="logoUrl" type="file" accept="image/*" className="mt-1" onChange={handleChange} />
      </label>
      <label className="block">Business Document (PDF):
        <input name="documentPdfUrl" type="file" accept="application/pdf" className="mt-1" onChange={handleChange} />
      </label>
      <div className="flex justify-between mt-2">
        <button type="button" className="text-orange underline" onClick={onBack}>Back</button>
        <button type="submit" className="bg-darkgreen text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}

export default RegistrationStepB;
