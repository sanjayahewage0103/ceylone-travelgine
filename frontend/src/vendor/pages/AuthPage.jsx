import React, { useState } from 'react';
import Login from '../components/Login';
import RegisterFlow from '../components/RegisterFlow';
import PendingApproval from '../components/PendingApproval';

const bgImage = 'https://images.unsplash.com/photo-1596354394985-bab185799a4e';

function AuthPage() {
  const [view, setView] = useState('login');
  const [pending, setPending] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 w-full max-w-md">
        {pending ? (
          <PendingApproval onBack={() => { setPending(false); setView('login'); }} />
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
