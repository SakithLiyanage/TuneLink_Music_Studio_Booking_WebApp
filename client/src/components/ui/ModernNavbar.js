import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiMusic, FiUser, FiLogOut, FiChevronDown, FiMenu, FiX,
  FiCompass, FiHome, FiHeadphones, FiInfo, FiSettings
} from 'react-icons/fi';

const ModernNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'client': return '/client';
      case 'artist': return '/artist';
      case 'studio': return '/studio';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  // Menu item variants for animation
  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Navigation links with icons
  const navigationLinks = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'Studios', path: '/studios', icon: <FiCompass /> },
    { name: 'Artists', path: '/artists', icon: <FiHeadphones /> },
    { name: 'About', path: '/about', icon: <FiInfo /> }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white shadow-md' 
          : 'py-4 bg-white/80 backdrop-blur-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-10">
            <motion.div 
              className="bg-gradient-to-r from-primary-600 to-primary-500 w-10 h-10 rounded-lg flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <FiMusic className="text-white text-xl" />
            </motion.div>
            <motion.span 
              className="text-2xl font-display font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-primary-600">Tune</span>
              <span className="text-secondary-500">Link</span>
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link 
                  to={link.path}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                    location.pathname === link.path 
                      ? 'text-primary-600 bg-primary-50/50' 
                      : 'text-text-light hover:text-primary-600 hover:bg-primary-50/30'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* User Section or Auth Buttons */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="relative">
                <motion.button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                    userMenuOpen ? 'bg-card' : 'hover:bg-card'
                  }`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-center">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-text-main">{currentUser.name}</span>
                  <FiChevronDown className={`transition-transform text-primary-600 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-primary-100"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                      <motion.div
                        className="px-4 py-3 border-b border-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="font-medium text-gray-800">{currentUser.email}</p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            currentUser.role === 'artist' ? 'bg-blue-100 text-blue-700' :
                            currentUser.role === 'studio' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                          </span>
                        </div>
                      </motion.div>
                      
                      <div className="py-1">
                        <Link 
                          to={getDashboardUrl()}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiUser className="mr-3 text-primary-500" />
                          Dashboard
                        </Link>
                        <Link 
                          to={`${getDashboardUrl()}/profile`}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiSettings className="mr-3 text-primary-500" />
                          Settings
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button 
                    className="px-5 py-2 text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button 
                    className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:shadow-md transition font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${mobileMenuOpen ? 'bg-gray-100' : ''}`}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <FiX size={24} className="text-gray-700" />
              ) : (
                <FiMenu size={24} className="text-gray-700" />
              )}
            </motion.button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  {navigationLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                          location.pathname === link.path
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-gray-200 pt-4"
                >
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-center">
                            {currentUser.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <Link
                        to={getDashboardUrl()}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiUser />
                        <span>Dashboard</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiLogOut />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 px-4">
                      <Link
                        to="/login"
                        className="py-3 text-center text-primary-600 border-2 border-primary-600 rounded-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        className="py-3 text-center bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default ModernNavbar;

