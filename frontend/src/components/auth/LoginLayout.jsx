import React from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../common/MainNavbar';
import Footer from '../common/Footer';

const LoginLayout = ({ 
  children, 
  userType, 
  title, 
  subtitle,
  backgroundVideo = "/13809264_2560_1440_60fps.mp4",
  backgroundImage = "/Ceylon.png" 
}) => {
  // Helper to get the appropriate colors for each user type
  const getUserTypeColors = () => {
    switch(userType) {
      case 'tourist':
        return {
          primary: 'teal-500',
          secondary: 'teal-600',
          light: 'teal-400',
          gradient: 'from-teal-600 to-teal-900',
          textGradient: 'from-teal-300 to-teal-100'
        };
      case 'guide':
        return {
          primary: 'teal-500',
          secondary: 'teal-600',
          light: 'teal-400',
          gradient: 'from-teal-600 to-teal-900',
          textGradient: 'from-teal-300 to-teal-100'
        };
      case 'vendor':
        return {
          primary: 'purple-600',
          secondary: 'purple-700',
          light: 'purple-400',
          gradient: 'from-purple-600 to-purple-900',
          textGradient: 'from-purple-300 to-purple-100'
        };
      case 'admin':
        return {
          primary: 'red-600',
          secondary: 'red-700',
          light: 'red-400',
          gradient: 'from-red-600 to-red-900',
          textGradient: 'from-red-300 to-red-100'
        };
      default:
        return {
          primary: 'teal-500',
          secondary: 'teal-600',
          light: 'teal-400',
          gradient: 'from-teal-600 to-teal-900',
          textGradient: 'from-teal-300 to-teal-100'
        };
    }
  };

  const colors = getUserTypeColors();
  
  return (
    <>
      <MainNavbar />
      
      <div className="relative min-h-screen flex flex-col">
        {/* Video or Image Background */}
        {backgroundVideo ? (
          <>
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={backgroundVideo}
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Overlay for better text visibility */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/60 z-0" 
            />
          </>
        ) : (
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {/* Overlay for better text visibility */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/60 z-0" 
            />
          </div>
        )}
        
        {/* Content */}
        <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center relative z-10">
          <div className="w-full max-w-xl">
            {/* Title Section with Animation */}
            <div className="text-center mb-8 transform transition-all duration-700 animate-fadeIn">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-white`}>
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${colors.textGradient}`}>
                  {title || `${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`}
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-md mx-auto">
                {subtitle || `Access your ${userType} account and manage your Ceylon Travelgine experience`}
              </p>
            </div>
            
            {/* Login Card with Glassmorphism */}
            <div 
              className="backdrop-blur-md bg-white/10 rounded-xl shadow-2xl overflow-hidden border border-white/20
                transform transition-all duration-700 hover:scale-[1.02] animate-slideUp"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {children}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default LoginLayout;
