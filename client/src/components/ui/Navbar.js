import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMusic, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'client':
        return '/client';
      case 'artist':
        return '/artist';
      case 'studio':
        return '/studio';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };
  
  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-600 font-medium' : 'text-gray-700';
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
              <FiMusic className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">TuneLink</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} hover:text-primary-600 transition`}>
              Home
            </Link>
            <Link to="/studios" className={`${isActive('/studios')} hover:text-primary-600 transition`}>
              Studios
            </Link>
            <Link to="/artists" className={`${isActive('/artists')} hover:text-primary-600 transition`}>
              Artists
            </Link>
            <Link to="/about" className={`${isActive('/about')} hover:text-primary-600 transition`}>
              About
            </Link>

            {currentUser ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span>{currentUser.name}</span>
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full border-2 border-primary-300 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-primary text-white flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <FiChevronDown className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-xl py-2 z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={getDashboardUrl()}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="mr-3 text-primary-500" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-3 text-primary-500" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-5 py-2 text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-md transition"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              className="md:hidden mt-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex flex-col space-y-4 pb-5"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.07 }
                  }
                }}
              >
                {['Home', 'Studios', 'Artists', 'About'].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      className={`${
                        location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`)
                          ? 'text-primary-600 font-medium'
                          : 'text-gray-700'
                      } hover:text-primary-600 block py-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}

                {currentUser ? (
                  <>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <Link
                        to={getDashboardUrl()}
                        className="text-gray-700 hover:text-primary-600 block py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        className="text-left text-gray-700 hover:text-primary-600 block py-2 w-full"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    className="flex flex-col space-y-3 pt-2"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      to="/login"
                      className="px-4 py-2 text-center text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-gradient-primary text-center text-white rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
