import React, { useState } from 'react';
import RegisterFlow from '../../components/vendor/RegisterFlow';
import VendorLogin from '../../components/vendor/VendorLogin';
import LoginLayout from '../../components/auth/LoginLayout';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const VendorAuthPage = () => {
  const [view, setView] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await authService.login(email, password);
      if (result.token) {
        // Save token for authenticated requests
        localStorage.setItem('token', result.token);
      } else {
        setError('No token received. Login failed.');
        setLoading(false);
        return;
      }
      if (result.user && result.user.role === 'vendor' && result.user.status === 'approved') {
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/vendor/dashboard');
        }, 1000);
      } else if (result.user && result.user.role === 'vendor' && result.user.status !== 'approved') {
        setError('Your vendor account is not approved yet.');
      } else {
        setError('Invalid vendor credentials.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      userType="vendor"
      title="Vendor Portal"
      subtitle="Grow your business and reach travelers from around the world"
      backgroundVideo="/videos/vendor-bg.mp4"
    >
      <div className="p-8">
        <div className="mb-6 flex justify-between border-b border-white/20 pb-4">
          <button 
            onClick={() => setView('register')} 
            className={`text-lg font-medium pb-2 px-4 ${view === 'register' 
              ? 'text-purple-300 border-b-2 border-purple-400' 
              : 'text-white/70 hover:text-white'}`}
          >
            Register
          </button>
          <button 
            onClick={() => setView('login')} 
            className={`text-lg font-medium pb-2 px-4 ${view === 'login' 
              ? 'text-purple-300 border-b-2 border-purple-400' 
              : 'text-white/70 hover:text-white'}`}
          >
            Login
          </button>
        </div>

        <div className="animate-fadeIn">
          {view === 'register' ? (
            <RegisterFlow onSwitchToLogin={() => setView('login')} />
          ) : (
            <>
              <VendorLogin 
                onSwitchToRegister={() => setView('register')}
                error={error}
                success={success}
                loading={loading}
                onLogin={handleLogin}
              />
              {success && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-center">
                  {success}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-8 text-center text-white/70">
          <p>Looking for other opportunities?</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/guide" className="text-purple-300 hover:text-purple-200 transition-colors">
              Join as Guide
            </a>
            <a href="/tourist" className="text-purple-300 hover:text-purple-200 transition-colors">
              Continue as Tourist
            </a>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default VendorAuthPage;
