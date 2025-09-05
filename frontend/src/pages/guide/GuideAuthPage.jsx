
import React, { useState } from 'react';
import GuideRegisterSinglePage from '../../components/guide/GuideRegisterSinglePage';
import BusinessNavbar from '../../components/common/BusinessNavbar';
import GuideLogin from '../../components/guide/GuideLogin';

const GuideAuthPage = () => {
  const [view, setView] = useState('login');

  return (
    <>
      <BusinessNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl p-8 bg-white rounded shadow">
        {view === 'register' ? (
          <GuideRegisterSinglePage onSwitchToLogin={() => setView('login')} />
        ) : (
          <GuideLogin onSwitchToRegister={() => setView('register')} />
        )}
        </div>
      </div>
    </>
  );
};

export default GuideAuthPage;
