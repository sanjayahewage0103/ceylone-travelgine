// AdminLoginPage.jsx: Container for admin login logic
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import LoginLayout from '../../components/auth/LoginLayout';

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await authService.login(email, password);
      if (result.token && result.user && result.user.role === 'admin') {
        // Store token for adminService usage
        if (rememberMe) {
          localStorage.setItem('token', result.token);
        } else {
          sessionStorage.setItem('token', result.token);
        }
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/admin/dashboard'); // Redirect after successful login
        }, 1000);
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      userType="admin"
      title="Administrator Portal"
      subtitle="Securely manage the Ceylon Travelgine platform"
      backgroundVideo="/videos/admin-bg.mp4"
    >
      <div className="p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-white/90 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg 
                  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                  transition-all duration-200"
                placeholder="admin@ceylontravelgine.com"
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-white/90 font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-red-300 hover:text-red-200">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg 
                  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                  transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {/* Remember Me & Security Note */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 bg-white/10 border border-white/20 rounded text-red-500 focus:ring-red-500 focus:ring-offset-0"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <span className="text-red-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v0m0-6v0M12 9a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Secure connection
              </span>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm animate-fadeIn">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm animate-fadeIn">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg 
                text-white ${loading ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors
                font-medium text-lg shadow-lg shadow-red-900/30 backdrop-blur-sm`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <span className="absolute right-4 inset-y-0 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/" className="text-red-300 hover:text-red-200 text-sm font-medium flex items-center justify-center group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Homepage
            </Link>
          </div>
        </form>
      </div>
    </LoginLayout>
  );
};

export default AdminLoginPage;
