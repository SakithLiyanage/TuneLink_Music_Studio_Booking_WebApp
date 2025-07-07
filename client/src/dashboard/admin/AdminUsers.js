import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiKey,
  FiUser,
  FiMusic,
  FiHome,
  FiSettings,
  FiPlus,
  FiDownload
} from 'react-icons/fi';
import { usersAPI } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAction = async (action, userId, data = {}) => {
    try {
      switch (action) {
        case 'verify':
          await usersAPI.updateVerification(userId, data.isVerified);
          break;
        case 'activate':
          await usersAPI.updateActiveStatus(userId, data.isActive);
          break;
        case 'role':
          await usersAPI.assignRole(userId, data.role);
          break;
        case 'password':
          await usersAPI.resetPassword(userId, data.password);
          break;
        case 'delete':
          await usersAPI.delete(userId);
          break;
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setModalData({});
    setShowModal(true);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FiShield className="text-red-500" />;
      case 'artist': return <FiMusic className="text-purple-500" />;
      case 'studio': return <FiHome className="text-green-500" />;
      default: return <FiUser className="text-blue-500" />;
    }
  };

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Inactive</span>;
    }
    if (!user.isVerified) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Unverified</span>;
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
              <h3 className="text-lg font-semibold mb-4">Verify User</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to {selectedUser?.isVerified ? 'unverify' : 'verify'} this user?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('verify', selectedUser._id, { isVerified: !selectedUser.isVerified })}
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

        case 'activate':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Activate/Deactivate User</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to {selectedUser?.isActive ? 'deactivate' : 'activate'} this user?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('activate', selectedUser._id, { isActive: !selectedUser.isActive })}
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

        case 'role':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Assign Role</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Select Role</label>
                  <select
                    value={modalData.role || selectedUser?.role}
                    onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="client">Client</option>
                    <option value="artist">Artist</option>
                    <option value="studio">Studio</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction('role', selectedUser._id, { role: modalData.role })}
                    className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                  >
                    Update Role
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

        case 'password':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">New Password</label>
                  <input
                    type="password"
                    value={modalData.password || ''}
                    onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction('password', selectedUser._id, { password: modalData.password })}
                    className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors"
                  >
                    Reset Password
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

        case 'delete':
          return (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Delete User</h3>
              <p className="text-dark/60 mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction('delete', selectedUser._id)}
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
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">User Management</h1>
          <p className="text-dark/60 text-lg">Manage all platform users</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="artist">Artists</option>
                <option value="studio">Studios</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/80 rounded-2xl border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-glass/80 rounded-3xl border border-primary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={user.avatar || 'https://via.placeholder.com/40'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-semibold text-dark">{user.name}</p>
                            <p className="text-sm text-dark/60">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark/60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('verify', user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Verify/Unverify"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => openModal('activate', user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            title="Activate/Deactivate"
                          >
                            <FiUser size={16} />
                          </button>
                          <button
                            onClick={() => openModal('role', user)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                            title="Change Role"
                          >
                            <FiShield size={16} />
                          </button>
                          <button
                            onClick={() => openModal('password', user)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            title="Reset Password"
                          >
                            <FiKey size={16} />
                          </button>
                          <button
                            onClick={() => openModal('delete', user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete User"
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
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-6xl text-dark/20 mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">No users found</h3>
            <p className="text-dark/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default AdminUsers;
