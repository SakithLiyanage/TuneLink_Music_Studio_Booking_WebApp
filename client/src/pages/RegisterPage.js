import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiArrowRight, FiUserCheck, FiHome, FiMusic } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract role from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam && ['client', 'artist', 'studio'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      const userData = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Redirect based on user role
      switch (userData.user.role) {
        case 'client':
          navigate('/client');
          break;
        case 'artist':
          navigate('/artist/profile?new=true');
          break;
        case 'studio':
          navigate('/studio/profile?new=true');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  
  const roleOptions = [
    { id: 'client', label: 'Client', icon: <FiUserCheck /> },
    { id: 'artist', label: 'Artist', icon: <FiMusic /> },
    { id: 'studio', label: 'Studio', icon: <FiHome /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="bg-glass/80 rounded-3xl shadow-glass overflow-hidden backdrop-blur-xs border border-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 px-8 py-10 text-white text-center">
              <h1 className="text-4xl font-extrabold tracking-tight">Create Account</h1>
              <p className="mt-3 text-lg font-medium text-primary-100">Join TuneLink today and start connecting</p>
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
                <div className="mb-7">
                  <label htmlFor="name" className="block text-lg font-semibold text-dark mb-3">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiUser className="text-xl" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                <div className="mb-7">
                  <label htmlFor="email" className="block text-lg font-semibold text-dark mb-3">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiMail className="text-xl" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="mb-7">
                  <label htmlFor="password" className="block text-lg font-semibold text-dark mb-3">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiLock className="text-xl" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="At least 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <div className="mb-7">
                  <label htmlFor="passwordConfirm" className="block text-lg font-semibold text-dark mb-3">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FiLock className="text-xl" />
                    </div>
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                      placeholder="Confirm password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <div className="mb-10">
                  <label className="block text-lg font-semibold text-dark mb-3">I am registering as</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        className={`flex flex-col items-center justify-center px-0 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 shadow-inner hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-100 ${
                          formData.role === role.id
                            ? 'border-primary-700 bg-primary-100/70 text-primary-700 shadow-glass' : 'border-primary-100 text-dark hover:text-primary-700'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                      >
                        <span className="mb-2 text-2xl">{role.icon}</span>
                        {role.label}
                      </button>
                    ))}
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
                        Creating account...
                      </span>
                      : 
                      <span className="flex items-center justify-center">
                        Create Account
                        <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform text-xl" />
                      </span>
                    }
                  </button>
                </div>
              </form>
              <p className="text-center text-dark/70 text-lg font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-700 hover:text-primary-800 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
