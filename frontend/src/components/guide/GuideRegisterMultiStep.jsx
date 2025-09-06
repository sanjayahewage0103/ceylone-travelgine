import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import { motion } from 'framer-motion';

const GuideRegisterMultiStep = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    contact: '', 
    nic: '', 
    password: '', 
    confirmPassword: '',
    sltdaRegNum: '', 
    experienceYears: '', 
    languagesSpoken: '', 
    tourTypesOffered: '', 
    bio: '',
    profilePic: null, 
    verificationPhoto: null, 
    sltdaLicensePic: null, 
    documentPdf: null,
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

  const handleNextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.fullName || !formData.email || !formData.contact || !formData.nic || 
          !formData.password || !formData.confirmPassword) {
        setError('Please fill all fields in this step');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (step === 2) {
      // Validate second step
      if (!formData.sltdaRegNum || !formData.experienceYears || 
          !formData.languagesSpoken || !formData.tourTypesOffered || !formData.bio) {
        setError('Please fill all fields in this step');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!agreed) {
      setError('You must agree to the terms');
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 text-center text-white"
      >
        <h2 className="text-2xl font-bold text-teal-300 mb-4">Registration Submitted!</h2>
        <p className="text-white mb-6">Thank you for registering as a guide. Your profile is under review.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button onClick={onSwitchToLogin} className="bg-teal-600 hover:bg-teal-700 text-white">
            Return to Login
          </Button>
          <Link to="/">
            <Button className="bg-transparent border border-teal-400 text-teal-300 hover:bg-teal-900/30">
              Go to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center text-teal-300 mb-4">Step 1: Personal Information</h2>
            <Input 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="contact" 
              placeholder="Contact Number" 
              value={formData.contact} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="nic" 
              placeholder="NIC Number" 
              value={formData.nic} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center text-teal-300 mb-4">Step 2: Professional Information</h2>
            <Input 
              name="sltdaRegNum" 
              placeholder="SLTDA Registration Number" 
              value={formData.sltdaRegNum} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="experienceYears" 
              type="number" 
              placeholder="Years of Experience" 
              value={formData.experienceYears} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="languagesSpoken" 
              placeholder="Languages Spoken (e.g., English, German)" 
              value={formData.languagesSpoken} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Input 
              name="tourTypesOffered" 
              placeholder="Tour Types (e.g., Historical, Wildlife)" 
              value={formData.tourTypesOffered} 
              onChange={handleChange} 
              required 
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <textarea 
              name="bio" 
              placeholder="A short bio about yourself for tourists..." 
              value={formData.bio} 
              onChange={handleChange} 
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" 
              rows="3" 
              required
            ></textarea>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-center text-teal-300 mb-4">Step 3: Verification Documents</h2>
            <p className="text-white/70 text-center text-sm">Upload the required documents for verification. Please ensure all documents are clear and legible.</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <label className="block text-sm font-medium text-white mb-2">Profile Picture</label>
                <input 
                  name="profilePic" 
                  type="file" 
                  accept="image/*" 
                  className="file-input w-full text-white text-sm" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <label className="block text-sm font-medium text-white mb-2">Verification Photo (with NIC)</label>
                <input 
                  name="verificationPhoto" 
                  type="file" 
                  accept="image/*" 
                  className="file-input w-full text-white text-sm" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <label className="block text-sm font-medium text-white mb-2">SLTDA License Photo</label>
                <input 
                  name="sltdaLicensePic" 
                  type="file" 
                  accept="image/*" 
                  className="file-input w-full text-white text-sm" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <label className="block text-sm font-medium text-white mb-2">Other Documents (PDF, Optional)</label>
                <input 
                  name="documentPdf" 
                  type="file" 
                  accept=".pdf" 
                  className="file-input w-full text-white text-sm" 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <input 
                type="checkbox" 
                id="guide-agree-checkbox" 
                checked={agreed} 
                onChange={e => setAgreed(e.target.checked)} 
                className="h-5 w-5 text-teal-600 border-white/20 rounded focus:ring-teal-500" 
              />
              <label htmlFor="guide-agree-checkbox" className="ml-3 block text-sm text-white/90">
                I have read and agree to the Ceylone Travelgine Guide Service Provider Agreement.
              </label>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(stepNumber => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= stepNumber ? 'bg-teal-500 text-white' : 'bg-gray-400/30 text-white/70'
                }`}
              >
                {stepNumber}
              </div>
              <span className="text-xs mt-1 text-white/80">
                {stepNumber === 1 ? 'Personal' : stepNumber === 2 ? 'Professional' : 'Documents'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-white">
      {renderProgressBar()}
      
      {error && (
        <div className="bg-red-600/20 border border-red-400/30 text-red-200 p-3 rounded-lg text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button 
              onClick={handlePreviousStep} 
              type="button"
              className="bg-transparent border border-white/30 text-white hover:bg-white/10"
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNextStep} 
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white ml-auto"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white ml-auto"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </form>
      
      <div className="text-center mt-4 text-white/80">
        <span>Already have an account? </span>
        <button onClick={onSwitchToLogin} className="text-teal-300 hover:text-teal-200 font-semibold transition-colors">
          Login here
        </button>
      </div>
    </div>
  );
};

export default GuideRegisterMultiStep;
