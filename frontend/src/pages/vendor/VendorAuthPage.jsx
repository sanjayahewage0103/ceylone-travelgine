import React, { useState } from 'react';
import RegisterFlow from '../../components/vendor/RegisterFlow';
import VendorLogin from '../../components/vendor/VendorLogin';

const VendorAuthPage = () => {
  const [view, setView] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        {view === 'register' ? (
          <RegisterFlow onSwitchToLogin={() => setView('login')} />
        ) : (
          <VendorLogin onSwitchToRegister={() => setView('register')} />
        )}
      </div>
    </div>
  );
};

export default VendorAuthPage;
