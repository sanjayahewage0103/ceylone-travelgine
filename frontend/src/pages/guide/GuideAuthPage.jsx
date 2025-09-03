import React, { useState } from 'react';
import RegisterFlow from '../../components/guide/RegisterFlow';

const GuideAuthPage = () => {
  const [view, setView] = useState('register');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        {view === 'register' ? (
          <RegisterFlow onSwitchToLogin={() => setView('login')} />
        ) : (
          <div>Guide Login (Coming Soon)</div>
        )}
      </div>
    </div>
  );
};

export default GuideAuthPage;
