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
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-primary px-6 py-8 text-white text-center">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="mt-2 text-blue-100">Join TuneLink today and start connecting</p>
            </div>
            
            <div className="p-6 md:p-8">
              {error && (
                <motion.div 
                  className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiAlertCircle className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FiUser />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FiMail />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FiLock />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="At least 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FiLock />
                    </div>
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="Confirm password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="form-label">I am registering as</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg transition ${
                          formData.role === role.id
                            ? 'bg-primary-50 text-primary-700 border-2 border-primary-500'
                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className={`text-2xl mb-2 ${formData.role === role.id ? 'text-primary-600' : 'text-gray-500'}`}>
                          {role.icon}
                        </div>
                        <span className="font-medium">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full btn btn-primary group"
                    disabled={loading}
                  >
                    {loading ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                      : 
                      <span className="flex items-center justify-center">
                        Create Account
                        <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    }
                  </button>
                </div>
              </form>
              
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
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
