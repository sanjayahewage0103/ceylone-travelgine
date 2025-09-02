import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import RegistrationStepA from './RegistrationStepA';
import RegistrationStepB from './RegistrationStepB';
import RegistrationStepC from './RegistrationStepC';
import AuthService from '../services/authService';

function RegisterFlow({ onSwitch, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nextStep = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await AuthService.registerVendor({ ...formData, ...data });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProgressBar step={step} />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {step === 1 && <RegistrationStepA onNext={nextStep} onBack={onSwitch} />}
      {step === 2 && <RegistrationStepB onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <RegistrationStepC onSubmit={handleSubmit} onBack={prevStep} loading={loading} />}
    </div>
  );
}

export default RegisterFlow;
