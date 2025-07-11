import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiCalendar, FiClock, FiMusic, FiGrid, FiMap, FiUser, 
  FiPlus, FiMoreHorizontal, FiChevronRight 
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bookings (mock data for now)
    setTimeout(() => {
      setUpcomingBookings([
        {
          id: '1',
          type: 'studio',
          name: 'Celestial Sound Studios',
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500',
          date: '2023-12-15',
          time: '14:00 - 16:00',
          status: 'confirmed'
        },
        {
          id: '2',
          type: 'artist',
          name: 'Amal Perera',
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          date: '2023-12-20',
          time: '18:00 - 20:00',
          status: 'pending'
        }
      ]);
      
      setRecentBookings([
        {
          id: '3',
          type: 'studio',
          name: 'Rhythm Nation',
          image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=500',
          date: '2023-11-30',
          time: '10:00 - 14:00',
          status: 'completed'
        }
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome, {currentUser?.name || 'Client'}</h1>
          <p className="text-gray-600 mb-8">Here's an overview of your activities and bookings</p>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          variants={itemVariants}
        >
          <Link
            to="/studios"
            className="bg-white p-5 rounded-xl shadow-soft hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <FiMusic size={22} />
            </div>
            <div>
              <h3 className="font-semibold">Find Studios</h3>
              <p className="text-gray-600 text-sm">Book recording time</p>
            </div>
            <FiChevronRight className="ml-auto text-gray-400" />
          </Link>
          
          <Link
            to="/artists"
            className="bg-white p-5 rounded-xl shadow-soft hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
              <FiUser size={22} />
            </div>
            <div>
              <h3 className="font-semibold">Find Artists</h3>
              <p className="text-gray-600 text-sm">Collaborate with musicians</p>
            </div>
            <FiChevronRight className="ml-auto text-gray-400" />
          </Link>
          
          <Link
            to="/client/bookings"
            className="bg-white p-5 rounded-xl shadow-soft hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
              <FiCalendar size={22} />
            </div>
            <div>
              <h3 className="font-semibold">My Bookings</h3>
              <p className="text-gray-600 text-sm">View all reservations</p>
            </div>
            <FiChevronRight className="ml-auto text-gray-400" />
          </Link>
        </motion.div>
        
        {/* Upcoming Bookings */}
        <motion.div 
          className="mb-10"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Bookings</h2>
            <Link 
              to="/client/bookings"
              className="text-primary-600 text-sm flex items-center"
            >
              View All <FiChevronRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-soft p-6 flex justify-center">
              <LoadingSpinner text="Loading bookings..." />
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map(booking => (
                <div 
                  key={booking.id}
                  className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={booking.image}
                        alt={booking.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{booking.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <FiCalendar className="mr-1" size={14} />
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <FiClock className="mr-1" size={14} />
                          {booking.time}
                        </p>
                      </div>
                      <div className="mt-2 text-right">
                        <Link 
                          to={`/client/bookings/${booking.id}`}
                          className="text-primary-600 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <FiCalendar className="mx-auto text-gray-400 mb-3" size={32} />
              <h3 className="font-medium mb-1">No Upcoming Bookings</h3>
              <p className="text-gray-600 text-sm mb-4">Book a studio or artist to get started</p>
              <Link to="/studios" className="btn btn-primary inline-flex">
                Book Now
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          
          {loading ? (
            <div className="h-48 bg-white rounded-xl shadow-soft flex justify-center items-center">
              <LoadingSpinner text="Loading activity..." />
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <ul className="divide-y">
                {recentBookings.map(booking => (
                  <li key={booking.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <img 
                        src={booking.image} 
                        alt={booking.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-medium">{booking.name}</h4>
                        <p className="text-sm text-gray-600">
                          Completed on {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <button className="text-primary-600 text-sm">
                          Write a Review
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <p className="text-gray-600">No recent activity</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClientDashboard;
