import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, FiCalendar, FiUser, FiSettings, FiLogOut, 
  FiMenu, FiX, FiMusic, FiGrid, FiImage, FiClock 
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
          { name: 'Bookings', path: '/admin/bookings', icon: <FiCalendar /> }
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-4 md:hidden flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-8 h-8 rounded-md flex items-center justify-center">
            <FiMusic className="text-white" />
          </div>
          <span className="font-bold text-lg">TuneLink</span>
        </Link>
        
        <div className="w-8"></div> {/* Spacer to center the logo */}
      </header>

      <div className="flex h-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-md">
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-8 h-8 rounded-md flex items-center justify-center">
                <FiMusic className="text-white" />
              </div>
              <span className="font-bold text-lg">TuneLink</span>
            </Link>
          </div>
          
          <div className="flex flex-col justify-between h-full">
            <nav className="p-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        location.pathname === link.path
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 mt-auto">
              <div className="border-t pt-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-2">
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-8 h-8 rounded-md flex items-center justify-center">
                      <FiMusic className="text-white" />
                    </div>
                    <span className="font-bold text-lg">TuneLink</span>
                  </Link>
                  
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-600 focus:outline-none"
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="mt-8">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                            location.pathname === link.path
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {link.icon}
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t mt-6 pt-4">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
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
        <main className="flex-1">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
