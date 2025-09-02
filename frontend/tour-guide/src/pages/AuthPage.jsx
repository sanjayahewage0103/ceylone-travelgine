import React, { useState } from 'react';
import Login from '../components/Login';
import RegisterFlow from '../components/RegisterFlow';
import PendingApproval from '../components/PendingApproval';

function AuthPage() {
  const [view, setView] = useState('login');
  const [pending, setPending] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md">
        {pending ? (
          <PendingApproval />
        ) : view === 'login' ? (
          <Login onSwitch={() => setView('register')} onSuccess={() => setPending(true)} />
        ) : (
          <RegisterFlow onSwitch={() => setView('login')} onSuccess={() => setPending(true)} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
