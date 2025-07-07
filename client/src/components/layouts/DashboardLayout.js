import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, FiCalendar, FiUser, FiSettings, FiLogOut, 
  FiMenu, FiX, FiMusic, FiGrid, FiImage, FiClock, FiStar 
} from 'react-icons/fi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine navigation links based on user role
  const getNavLinks = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'client':
        return [
          { name: 'Dashboard', path: '/client', icon: <FiHome /> },
          { name: 'My Bookings', path: '/client/bookings', icon: <FiCalendar /> },
          { name: 'Profile', path: '/client/profile', icon: <FiUser /> }
        ];
      case 'artist':
        return [
          { name: 'Dashboard', path: '/artist', icon: <FiHome /> },
          { name: 'Profile', path: '/artist/profile', icon: <FiUser /> },
          { name: 'Bookings', path: '/artist/bookings', icon: <FiCalendar /> },
          { name: 'Media', path: '/artist/media', icon: <FiMusic /> },
          { name: 'Availability', path: '/artist/availability', icon: <FiClock /> }
        ];
      case 'studio':
        return [
          { name: 'Dashboard', path: '/studio', icon: <FiHome /> },
          { name: 'Profile', path: '/studio/profile', icon: <FiUser /> },
          { name: 'Bookings', path: '/studio/bookings', icon: <FiCalendar /> },
          { name: 'Images', path: '/studio/images', icon: <FiImage /> },
          { name: 'Availability', path: '/studio/availability', icon: <FiClock /> }
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
          { name: 'Users', path: '/admin/users', icon: <FiUser /> },
          { name: 'Studios', path: '/admin/studios', icon: <FiGrid /> },
          { name: 'Artists', path: '/admin/artists', icon: <FiMusic /> },
          { name: 'Bookings', path: '/admin/bookings', icon: <FiCalendar /> },
          { name: 'Reviews', path: '/admin/reviews', icon: <FiStar /> }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light">
      {/* Mobile Header */}
      <header className="bg-white/80 shadow-glass py-4 px-4 md:hidden flex items-center justify-between backdrop-blur-xs border-b border-primary-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-primary-700 focus:outline-none hover:bg-primary-50 p-2 rounded-lg transition"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary-700 to-accent-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-glass">
            <FiMusic className="text-white text-xl" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent drop-shadow">TuneLink</span>
        </Link>
        <div className="w-8"></div>
      </header>
      <div className="flex h-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-72 bg-glass/90 shadow-glass border-r border-primary-50 backdrop-blur-xs">
          <div className="p-8 border-b border-primary-50">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-700 to-accent-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-glass">
                <FiMusic className="text-white text-xl" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent drop-shadow">TuneLink</span>
            </Link>
          </div>
          <div className="flex flex-col justify-between h-full">
            <nav className="p-6">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-4 px-5 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-inner hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-100 ${
                        location.pathname === link.path
                          ? 'text-primary-700 bg-primary-100/70 shadow-glass' : 'text-dark hover:text-primary-700'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-6 mt-auto">
              <div className="border-t border-primary-50 pt-6">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-4 px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
        {/* Mobile Sidebar - Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-glass/95 shadow-glass p-6 border-r border-primary-50 backdrop-blur-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-2">
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-primary-700 to-accent-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-glass">
                      <FiMusic className="text-white text-xl" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent drop-shadow">TuneLink</span>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-primary-700 focus:outline-none hover:bg-primary-50 p-2 rounded-lg transition"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="mt-10">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center space-x-4 px-5 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-inner hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-100 ${
                            location.pathname === link.path
                              ? 'text-primary-700 bg-primary-100/70 shadow-glass' : 'text-dark hover:text-primary-700'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {link.icon}
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-primary-50 mt-8 pt-6">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-4 px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-lg transition-all duration-200"
                    >
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen p-2 md:p-8">
          <div className="max-w-7xl mx-auto w-full bg-glass/80 rounded-3xl shadow-glass p-4 md:p-10 backdrop-blur-xs border border-primary-50 min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
