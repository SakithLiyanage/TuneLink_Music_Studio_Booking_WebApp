import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
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
  FiDownload
} from 'react-icons/fi';
import { studiosAPI } from '../../services/api';

const AdminStudios = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const response = await studiosAPI.getAll();
      setStudios(response.data.data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studio.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studio.services?.some(service => 
                           service.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && studio.isVerified) ||
                         (statusFilter === 'unverified' && !studio.isVerified) ||
                         (statusFilter === 'featured' && studio.featured) ||
                         (statusFilter === 'available' && studio.isAvailableForHire);
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (action, studioId, data = {}) => {
    try {
      switch (action) {
        case 'verify':
          await studiosAPI.adminVerify(studioId, data.isVerified);
          break;
        case 'deactivate':
          await studiosAPI.adminDeactivate(studioId, data.isAvailableForHire);
          break;
        case 'feature':
          await studiosAPI.adminFeature(studioId, data.featured);
          break;
        case 'delete':
          await studiosAPI.delete(studioId);
          break;
      }
      fetchStudios();
      setShowModal(false);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const openModal = (type, studio = null) => {
    setModalType(type);
    setSelectedStudio(studio);
    setModalData({});
    setShowModal(true);
  };

  const getStatusBadge = (studio) => {
    if (!studio.isAvailableForHire) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Unavailable</span>;
    }
    if (!studio.isVerified) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Unverified</span>;
    }
    if (studio.featured) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Featured</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
  };

  const Modal = () => {
    if (!showModal) return null;

    const renderModalContent = () => {
      switch (modalType) {
        case 'verify':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Verify Studio</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to {selectedStudio?.isVerified ? 'unverify' : 'verify'} this studio?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('verify', selectedStudio._id, { isVerified: !selectedStudio.isVerified })}
                  className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                >
                  Confirm
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

        case 'deactivate':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Activate/Deactivate Studio</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to {selectedStudio?.isAvailableForHire ? 'deactivate' : 'activate'} this studio?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('deactivate', selectedStudio._id, { isAvailableForHire: !selectedStudio.isAvailableForHire })}
                  className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                >
                  Confirm
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

        case 'feature':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Feature/Unfeature Studio</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to {selectedStudio?.featured ? 'unfeature' : 'feature'} this studio?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('feature', selectedStudio._id, { featured: !selectedStudio.featured })}
                  className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                >
                  Confirm
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
              <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Studio</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to delete this studio? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('delete', selectedStudio._id)}
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
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">Studio Management</h1>
          <p className="text-dark/60 text-lg">Manage all platform studios</p>
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
                  placeholder="Search studios by name, description, or services..."
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
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="featured">Featured</option>
                <option value="available">Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Studios Table */}
        <div className="bg-glass/80 rounded-3xl border border-primary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Studio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Services</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                <AnimatePresence>
                  {filteredStudios.map((studio, index) => (
                    <motion.tr
                      key={studio._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={studio.user?.avatar || 'https://via.placeholder.com/40'}
                            alt={studio.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-semibold text-dark">{studio.name}</p>
                            <p className="text-sm text-dark/60">{studio.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {studio.services?.slice(0, 2).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                              {service}
                            </span>
                          ))}
                          {studio.services?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
                              +{studio.services.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-dark/60">
                          <FiMapPin className="mr-1" />
                          {studio.location?.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiDollarSign className="text-green-500 mr-1" />
                          <span className="font-semibold text-dark">Rs. {studio.hourlyRate?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(studio)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('verify', studio)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Verify/Unverify"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => openModal('deactivate', studio)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            title="Activate/Deactivate"
                          >
                            <FiUser size={16} />
                          </button>
                          <button
                            onClick={() => openModal('feature', studio)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                            title="Feature/Unfeature"
                          >
                            <FiStar size={16} />
                          </button>
                          <button
                            onClick={() => openModal('delete', studio)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Studio"
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
        {filteredStudios.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiHome className="mx-auto text-6xl text-dark/20 mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">No studios found</h3>
            <p className="text-dark/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default AdminStudios;
