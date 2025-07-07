import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiSettings,
  FiPlus,
  FiDownload,
  FiMusic,
  FiHome,
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi';
import { artistsAPI, studiosAPI } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [artistReviews, studioReviews] = await Promise.all([
        artistsAPI.getAllReviews(),
        studiosAPI.getAllReviews()
      ]);

      const allReviews = [
        ...(artistReviews.data.data || []).map(review => ({ ...review, type: 'artist' })),
        ...(studioReviews.data.data || []).map(review => ({ ...review, type: 'studio' }))
      ];

      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.artist?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.studio?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || review.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAction = async (action, reviewId, data = {}) => {
    try {
      if (selectedReview.type === 'artist') {
        await artistsAPI.deleteReview(selectedReview.artist._id, reviewId);
      } else {
        await studiosAPI.deleteReview(selectedReview.studio._id, reviewId);
      }
      fetchReviews();
      setShowModal(false);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const openModal = (type, review = null) => {
    setModalType(type);
    setSelectedReview(review);
    setShowModal(true);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getTypeIcon = (type) => {
    return type === 'artist' ? <FiMusic className="text-purple-500" /> : <FiHome className="text-green-500" />;
  };

  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4"
        >
          <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Review</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <img
                  src={selectedReview?.user?.avatar || 'https://via.placeholder.com/32'}
                  alt={selectedReview?.user?.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="font-medium text-dark">{selectedReview?.user?.name}</p>
                  <div className="flex items-center">
                    {getRatingStars(selectedReview?.rating)}
                    <span className="ml-2 text-sm text-dark/60">
                      {selectedReview?.type === 'artist' ? 'Artist' : 'Studio'} Review
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-dark/80">{selectedReview?.comment}</p>
            </div>
            <p className="text-dark/60">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleAction('delete', selectedReview._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete Review
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-dark rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light pt-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">Review Management</h1>
          <p className="text-dark/60 text-lg">Moderate all platform reviews</p>
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
                  placeholder="Search reviews by user, comment, or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Reviews</option>
                <option value="artist">Artist Reviews</option>
                <option value="studio">Studio Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-glass/80 rounded-3xl border border-primary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Review</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                <AnimatePresence>
                  {filteredReviews.map((review, index) => (
                    <motion.tr
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-dark line-clamp-2">{review.comment}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={review.user?.avatar || 'https://via.placeholder.com/32'}
                            alt={review.user?.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium text-dark">{review.user?.name}</p>
                            <p className="text-xs text-dark/60">{review.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getTypeIcon(review.type)}
                          <div className="ml-2">
                            <p className="font-medium text-dark">
                              {review.artist?.user?.name || review.studio?.name}
                            </p>
                            <p className="text-xs text-dark/60 capitalize">{review.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRatingStars(review.rating)}
                          <span className="ml-2 text-sm font-medium text-dark">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark/60">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('delete', review)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Review"
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
        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiStar className="mx-auto text-6xl text-dark/20 mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">No reviews found</h3>
            <p className="text-dark/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default AdminReviews; 