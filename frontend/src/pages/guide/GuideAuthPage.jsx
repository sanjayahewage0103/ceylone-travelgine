
import React, { useState } from 'react';
import GuideRegisterSinglePage from '../../components/guide/GuideRegisterSinglePage';
import GuideLogin from '../../components/guide/GuideLogin';
import LoginLayout from '../../components/auth/LoginLayout';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const GuideAuthPage = () => {
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
        localStorage.setItem('token', result.token);
        if (result.user && result.user.role === 'guide' && result.user.id) {
          localStorage.setItem('guideId', result.user.id);
        }
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/guide/profile');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      userType="guide"
      title="Tour Guide Portal" 
      subtitle="Share your knowledge and expertise with travelers around the world"
      backgroundVideo="/videos/guide-bg.mp4"
    >
      <div className="p-8">
        <div className="mb-6 flex justify-between border-b border-white/20 pb-4">
          <button 
            onClick={() => setView('register')} 
            className={`text-lg font-medium pb-2 px-4 ${view === 'register' 
              ? 'text-teal-300 border-b-2 border-teal-400' 
              : 'text-white/70 hover:text-white'}`}
          >
            Register
          </button>
          <button 
            onClick={() => setView('login')} 
            className={`text-lg font-medium pb-2 px-4 ${view === 'login' 
              ? 'text-teal-300 border-b-2 border-teal-400' 
              : 'text-white/70 hover:text-white'}`}
          >
            Login
          </button>
        </div>

        <div className="animate-fadeIn">
          {view === 'register' ? (
            <GuideRegisterSinglePage onSwitchToLogin={() => setView('login')} />
          ) : (
            <>
              <GuideLogin 
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
            <a href="/vendor" className="text-teal-300 hover:text-teal-200 transition-colors">
              Join as Vendor
            </a>
            <a href="/tourist" className="text-teal-300 hover:text-teal-200 transition-colors">
              Continue as Tourist
            </a>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default GuideAuthPage;
