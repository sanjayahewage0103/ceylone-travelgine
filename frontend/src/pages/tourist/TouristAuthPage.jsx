import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Register from '../../components/tourist/Register';
import TouristLogin from '../../components/tourist/TouristLogin';
import LoginLayout from '../../components/auth/LoginLayout';
import authService from '../../services/authService';

const TouristAuthPage = () => {
  const [view, setView] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await authService.login(email, password);
      setSuccess('Login successful!');
      // Store user id for cart and auth
      if (data && data.user && data.user._id) {
        localStorage.setItem('userId', data.user._id);
      }
      // Optionally store token if returned
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to main home/dashboard
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      userType="tourist"
      title="Tourist Account"
      subtitle="Access exclusive travel experiences tailored to your interests"
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
            <Register onSwitchToLogin={() => setView('login')} />
          ) : (
            <>
              <TouristLogin
                onLogin={handleLogin}
                loading={loading}
                error={error}
                onSwitchToRegister={() => setView('register')}
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
          <p>Looking for business opportunities?</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/guide" className="text-teal-300 hover:text-teal-200 transition-colors">
              Join as Guide
            </Link>
            <Link to="/vendor" className="text-teal-300 hover:text-teal-200 transition-colors">
              Join as Vendor
            </Link>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default TouristAuthPage;
