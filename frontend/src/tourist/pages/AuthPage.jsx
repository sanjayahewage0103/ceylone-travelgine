
import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { AuthProvider } from '../context/AuthContext';

const bgImage = 'https://images.unsplash.com/photo-1596354394985-bab185799a4e';

export default function AuthPage() {
  const [view, setView] = useState('login');
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 w-full max-w-md">
          {view === 'login'
            ? <Login onSwitch={() => setView('register')} />
            : <Register onSwitch={() => setView('login')} />}
        </div>
      </div>
    </AuthProvider>
  );
}
