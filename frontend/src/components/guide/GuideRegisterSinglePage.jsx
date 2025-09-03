import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import GuideRegistrationStepC from './GuideRegistrationStepC';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const GuideRegisterSinglePage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', contact: '', nic: '', password: '', confirmPassword: '',
    sltdaRegNum: '', experienceYears: '', languagesSpoken: '', tourTypesOffered: '', bio: '',
    profilePic: null, verificationPhoto: null, sltdaLicensePic: null, documentPdf: null,
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? (files && files[0] ? files[0] : null) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms.');
      return;
    }
    setLoading(true);
    try {
      const data = { ...formData, role: 'guide' };
      await authService.register(data);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Submitted!</h2>
        <p className="text-gray-700 mb-2">Thank you for registering as a guide. Your profile is under review.</p>
        <Button onClick={onSwitchToLogin}>Return to Login</Button>
        <div className="mt-4">
          <Link to="/" className="text-cyan-700 underline font-semibold">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center text-cyan-700 mb-2">Tour Guide Registration</h2>
      {error && <div className="text-red-600 text-center font-medium">{error}</div>}
      <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
      <Input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
      <Input name="nic" placeholder="NIC Number" value={formData.nic} onChange={handleChange} required />
      <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
      <Input name="sltdaRegNum" placeholder="SLTDA Registration Number" value={formData.sltdaRegNum} onChange={handleChange} required />
      <Input name="experienceYears" type="number" placeholder="Years of Experience" value={formData.experienceYears} onChange={handleChange} required />
      <Input name="languagesSpoken" placeholder="Languages Spoken (e.g., English, German)" value={formData.languagesSpoken} onChange={handleChange} required />
      <Input name="tourTypesOffered" placeholder="Tour Types (e.g., Historical, Wildlife)" value={formData.tourTypesOffered} onChange={handleChange} required />
      <textarea name="bio" placeholder="A short bio about yourself for tourists..." value={formData.bio} onChange={handleChange} className="w-full p-3 border rounded-lg" rows="3" required></textarea>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input name="profilePic" type="file" accept="image/*" className="file-input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Verification Photo (with NIC)</label>
          <input name="verificationPhoto" type="file" accept="image/*" className="file-input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SLTDA License Photo</label>
          <input name="sltdaLicensePic" type="file" accept="image/*" className="file-input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Documents (PDF, Optional)</label>
          <input name="documentPdf" type="file" accept=".pdf" className="file-input" onChange={handleChange} />
        </div>
      </div>
      <div className="flex items-center mt-2">
        <input type="checkbox" id="guide-agree-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
        <label htmlFor="guide-agree-checkbox" className="ml-2 block text-sm text-gray-900">I have read and agree to the Ceylone Travelgine Guide Service Provider Agreement.</label>
      </div>
      <Button type="submit" fullWidth disabled={loading}>{loading ? 'Submitting...' : 'Complete Registration'}</Button>
    </form>
  );
};

export default GuideRegisterSinglePage;
