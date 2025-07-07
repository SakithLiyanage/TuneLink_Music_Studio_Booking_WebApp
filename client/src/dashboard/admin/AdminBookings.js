import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiSettings,
  FiPlus,
  FiDownload,
  FiClock,
  FiCheckSquare,
  FiXSquare,
  FiRefreshCw
} from 'react-icons/fi';
import { bookingsAPI } from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAll();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.artist?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.studio?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (action, bookingId, data = {}) => {
    try {
      switch (action) {
        case 'status':
          await bookingsAPI.adminUpdateStatus(bookingId, data.status, data.cancellationReason);
          break;
        case 'refund':
          await bookingsAPI.adminRefund(bookingId);
          break;
        case 'delete':
          await bookingsAPI.delete(bookingId);
          break;
      }
      fetchBookings();
      setShowModal(false);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const openModal = (type, booking = null) => {
    setModalType(type);
    setSelectedBooking(booking);
    setModalData({});
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'confirmed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Confirmed</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'confirmed':
        return <FiCheckSquare className="text-blue-500" />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXSquare className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const Modal = () => {
    if (!showModal) return null;

    const renderModalContent = () => {
      switch (modalType) {
        case 'status':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Update Booking Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Select Status</label>
                  <select
                    value={modalData.status || selectedBooking?.status}
                    onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {modalData.status === 'cancelled' && (
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Cancellation Reason</label>
                    <textarea
                      value={modalData.cancellationReason || ''}
                      onChange={(e) => setModalData({ ...modalData, cancellationReason: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter cancellation reason..."
                      rows={3}
                    />
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction('status', selectedBooking._id, { 
                      status: modalData.status, 
                      cancellationReason: modalData.cancellationReason 
                    })}
                    className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-dark rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );

        case 'refund':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-600">Process Refund</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to process a refund for this booking?</p>
              <div className="bg-amber-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Amount:</strong> Rs. {selectedBooking?.totalAmount?.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('refund', selectedBooking._id)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Process Refund
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-dark rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          );

        case 'delete':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Booking</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to delete this booking? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('delete', selectedBooking._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-dark rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full mx-4"
        >
          {renderModalContent()}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light pt-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">Booking Management</h1>
          <p className="text-dark/60 text-lg">Manage all platform bookings</p>
        </div>

        {/* Controls */}
        <div className="bg-glass/80 rounded-3xl p-6 mb-8 border border-primary-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark/40" />
                <input
                  type="text"
                  placeholder="Search bookings by client, artist, or studio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-glass/80 rounded-3xl border border-primary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Booking</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                <AnimatePresence>
                  {filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-dark">#{booking._id.slice(-8)}</p>
                          <p className="text-sm text-dark/60">{booking.serviceType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={booking.client?.avatar || 'https://via.placeholder.com/32'}
                            alt={booking.client?.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium text-dark">{booking.client?.name}</p>
                            <p className="text-xs text-dark/60">{booking.client?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={booking.artist?.user?.avatar || booking.studio?.user?.avatar || 'https://via.placeholder.com/32'}
                            alt={booking.artist?.user?.name || booking.studio?.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium text-dark">
                              {booking.artist?.user?.name || booking.studio?.name}
                            </p>
                            <p className="text-xs text-dark/60">
                              {booking.artist ? 'Artist' : 'Studio'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-dark">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                          <p className="text-dark/60">{booking.startTime} - {booking.endTime}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiDollarSign className="text-green-500 mr-1" />
                          <span className="font-semibold text-dark">Rs. {booking.totalAmount?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-2">{getStatusBadge(booking.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('status', booking)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Update Status"
                          >
                            <FiEdit size={16} />
                          </button>
                          {booking.status === 'completed' && (
                            <button
                              onClick={() => openModal('refund', booking)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Process Refund"
                            >
                              <FiRefreshCw size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => openModal('delete', booking)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Booking"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto text-6xl text-dark/20 mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">No bookings found</h3>
            <p className="text-dark/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default AdminBookings;
