import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiCheck, FiX, FiUser } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ArtistBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await bookingsAPI.getArtistBookings();
        setBookings(res.data.data || []);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await bookingsAPI.updateStatus(id, status);
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <LoadingSpinner text="Loading bookings..." />
    </div>
  );
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-10 md:p-14 border border-primary-100 backdrop-blur-xs"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center mb-8 gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              <FiCalendar />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">Artist Bookings</h1>
              <p className="text-dark/60 text-lg">Manage your artist bookings</p>
            </div>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-16 text-xl text-dark/60 font-semibold">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="p-3 text-primary-700 font-semibold">Client</th>
                    <th className="p-3 text-primary-700 font-semibold">Date</th>
                    <th className="p-3 text-primary-700 font-semibold">Time</th>
                    <th className="p-3 text-primary-700 font-semibold">Status</th>
                    <th className="p-3 text-primary-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <AnimatePresence>
                  <tbody>
                    {bookings.map(booking => (
                      <motion.tr
                        key={booking._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="bg-white/80 rounded-2xl shadow-glass border border-primary-50 hover:scale-[1.01] transition-all"
                      >
                        <td className="p-3 font-semibold text-primary-700 flex items-center gap-2">
                          <FiUser className="text-primary-400" /> {booking.client?.name || 'Client'}
                        </td>
                        <td className="p-3">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="p-3">{booking.startTime} - {booking.endTime}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-primary btn-xs inline-flex items-center gap-1 shadow-glass hover:scale-105 transition-all"
                                onClick={() => handleStatus(booking._id, 'confirmed')}
                                disabled={actionLoading === booking._id + 'confirmed'}
                              >
                                {actionLoading === booking._id + 'confirmed' ? <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span> : <FiCheck />} Accept
                              </button>
                              <button
                                className="btn btn-danger btn-xs inline-flex items-center gap-1 shadow-glass hover:scale-105 transition-all"
                                onClick={() => handleStatus(booking._id, 'cancelled')}
                                disabled={actionLoading === booking._id + 'cancelled'}
                              >
                                {actionLoading === booking._id + 'cancelled' ? <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span> : <FiX />} Reject
                              </button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArtistBookings;
