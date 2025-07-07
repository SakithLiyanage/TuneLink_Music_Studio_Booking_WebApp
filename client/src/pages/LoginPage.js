import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect path in the URL
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      const userData = await login(email, password);
      
      // Redirect based on user role
      switch (userData.user.role) {
        case 'client':
          navigate('/client');
          break;
        case 'artist':
          navigate('/artist');
          break;
        case 'studio':
          navigate('/studio');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate(from);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-glass/80 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xs border border-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 px-8 py-10 text-white text-center">
              <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="mt-3 text-lg font-medium text-primary-100">Sign in to access your TuneLink account</p>
            </div>
            
            <div className="p-8 md:p-10">
              {error && (
                <motion.div 
                  className="bg-red-50/80 text-red-700 p-5 rounded-2xl flex items-center mb-8 border border-red-200 backdrop-blur-xs"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiAlertCircle className="mr-3 flex-shrink-0 text-xl" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="email" className="block text-lg font-semibold text-dark mb-3">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiMail className="text-xl" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <label htmlFor="password" className="block text-lg font-semibold text-dark">Password</label>
                    <Link to="/forgot-password" className="text-sm text-primary-700 hover:text-primary-800 font-medium hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiLock className="text-xl" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                      : 
                      <span className="flex items-center justify-center">
                        Sign In
                        <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform text-xl" />
                      </span>
                    }
                  </button>
                </div>
              </form>
              
              <p className="text-center text-dark/70 text-lg font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-700 hover:text-primary-800 font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
