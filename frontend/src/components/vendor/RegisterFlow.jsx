
import React, { useState } from 'react';
import authService from '../../services/authService';
import ProgressBar from '../ui/ProgressBar'; // Optional visual indicator
import RegistrationStepA from './RegistrationStepA';
import RegistrationStepB from './RegistrationStepB';
import RegistrationStepC from '../shared/RegistrationStepC';
import PendingApproval from '../shared/PendingApproval';

/**
 * Container for vendor registration process
 */
const RegisterFlow = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState('stepA');
  const [formData, setFormData] = useState({
    fullName: '', email: '', contact: '', password: '', confirmPassword: '',
    shopName: '', businessRegNum: '', location: '', address: '', description: '',
    logo: null, documentPdf: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Called by child steps to pass data up
  const handleNextStep = (dataFromChild) => {
    setError('');
    setFormData(prevData => ({ ...prevData, ...dataFromChild }));
    if (step === 'stepA') {
      setStep('stepB');
    } else if (step === 'stepB') {
      setStep('stepC');
    }
  };

  // Final submission to backend
  const handleFinalSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Send all vendor shop fields as flat fields for backend compatibility
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'vendor',
        shopName: formData.shopName,
        businessRegNum: formData.businessRegNum,
        location: formData.location,
        address: formData.address,
        description: formData.description,
        logo: formData.logo,
        documentPdf: formData.documentPdf
      };
      await authService.register(payload);
      setStep('pending');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Progress bar percentage
  const progress = step === 'stepA' ? 33 : step === 'stepB' ? 66 : 100;

  return (
    <div>
      {step !== 'pending' && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Registration</h2>
          {/* Optional: <ProgressBar progress={progress} /> */}
        </div>
      )}
      {error && <p className="text-red-500 text-sm font-medium text-center mb-4">{error}</p>}
      {step === 'stepA' && <RegistrationStepA onNext={handleNextStep} initialData={formData} />}
      {step === 'stepB' && <RegistrationStepB onNext={handleNextStep} initialData={formData} />}
      {step === 'stepC' && <RegistrationStepC onFinalSubmit={handleFinalSubmit} loading={loading} />}
      {step === 'pending' && <PendingApproval userEmail={formData.email} onBackToLogin={onSwitchToLogin} />}
    </div>
  );
};

export default RegisterFlow;
