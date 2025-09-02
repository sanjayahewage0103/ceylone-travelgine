import React, { useState } from 'react';
import RegistrationStepA from './RegistrationStepA';
import RegistrationStepB from './RegistrationStepB';
import RegistrationStepC from './RegistrationStepC';
import ProgressBar from './ProgressBar';
import AuthService from '../services/authService';

function RegisterFlow({ onSwitch, onSuccess }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', contact: '', nic: '', password: '', confirmPassword: ''
  });
  const [guideDetails, setGuideDetails] = useState({
    sltdaRegNum: '', experienceYears: '', languagesSpoken: [], tourTypesOffered: [], bio: '',
    profilePic: null, verificationPhoto: null, sltdaLicensePic: null, documentPdf: null
  });
  const [agree, setAgree] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const submit = async () => {
    const payload = {
      ...form,
      guideDetails: {
        ...guideDetails,
        languagesSpoken: guideDetails.languagesSpoken,
        tourTypesOffered: guideDetails.tourTypesOffered,
        profilePicUrl: guideDetails.profilePic,
        verificationPhotoUrl: guideDetails.verificationPhoto,
        sltdaLicensePicUrl: guideDetails.sltdaLicensePic,
        documentPdfUrl: guideDetails.documentPdf
      }
    };
    await AuthService.registerGuide(payload);
    onSuccess();
  };

  return (
    <div>
      <ProgressBar step={step} />
      {step === 0 && <RegistrationStepA form={form} setForm={setForm} next={next} />}
      {step === 1 && <RegistrationStepB guideDetails={guideDetails} setGuideDetails={setGuideDetails} next={next} back={back} />}
      {step === 2 && <RegistrationStepC agree={agree} setAgree={setAgree} submit={submit} back={back} />}
    </div>
  );
}

export default RegisterFlow;
