import React, { useState } from 'react';
import Login from '../components/Login';
import RegisterFlow from '../components/RegisterFlow';
import PendingApproval from '../components/PendingApproval';


function AuthPage() {
  const [view, setView] = useState('login');
  const [pending, setPending] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-white">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200 animate-fade-in">
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
