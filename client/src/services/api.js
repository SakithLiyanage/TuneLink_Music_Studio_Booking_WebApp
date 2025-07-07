import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

// Add JWT token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateDetails: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password })
};

// Artists API
export const artistsAPI = {
  getAll: (params) => api.get('/artists', { params }),
  getById: (id) => api.get(`/artists/${id}`),
  create: (artistData) => api.post('/artists', artistData),
  update: (id, artistData) => api.put(`/artists/${id}`, artistData),
  delete: (id) => api.delete(`/artists/${id}`),
  updateAvailability: (id, availabilityData) => api.put(`/artists/${id}/availability`, availabilityData),
  uploadMedia: (id, formData) => api.put(`/artists/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addRating: (id, ratingData) => api.post(`/artists/${id}/ratings`, ratingData),
  getFeatured: () => api.get('/artists/featured'),
  search: (query) => api.get('/artists/search', { params: { q: query } }),
  // Admin endpoints
  adminVerify: (id, isVerified) => api.put(`/artists/${id}/verify`, { isVerified }),
  adminDeactivate: (id, isAvailableForHire) => api.put(`/artists/${id}/active`, { isAvailableForHire }),
  adminFeature: (id, featured) => api.put(`/artists/${id}/feature`, { featured }),
  getAdminStats: () => api.get('/artists/admin/stats'),
  getAllReviews: () => api.get('/artists/admin/reviews'),
  deleteReview: (artistId, reviewId) => api.delete(`/artists/${artistId}/reviews/${reviewId}`)
};

// Studios API
export const studiosAPI = {
  getAll: (params) => api.get('/studios', { params }),
  getById: (id) => api.get(`/studios/${id}`),
  create: (studioData) => api.post('/studios', studioData),
  update: (id, studioData) => api.put(`/studios/${id}`, studioData),
  delete: (id) => api.delete(`/studios/${id}`),
  updateAvailability: (id, availabilityData) => api.put(`/studios/${id}/availability`, availabilityData),
  uploadImages: (id, formData) => api.put(`/studios/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addRating: (id, ratingData) => api.post(`/studios/${id}/ratings`, ratingData),
  getFeatured: () => api.get('/studios/featured'),
  search: (query) => api.get('/studios/search', { params: { q: query } }),
  // Admin endpoints
  adminVerify: (id, isVerified) => api.put(`/studios/${id}/verify`, { isVerified }),
  adminDeactivate: (id, isAvailableForHire) => api.put(`/studios/${id}/active`, { isAvailableForHire }),
  adminFeature: (id, featured) => api.put(`/studios/${id}/feature`, { featured }),
  getAdminStats: () => api.get('/studios/admin/stats'),
  getAllReviews: () => api.get('/studios/admin/reviews'),
  deleteReview: (studioId, reviewId) => api.delete(`/studios/${studioId}/reviews/${reviewId}`)
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/me'),
  getClientBookings: () => api.get('/bookings/client'),
  getArtistBookings: () => api.get('/bookings/artist'),
  getStudioBookings: () => api.get('/bookings/studio'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  updatePayment: (id, paymentData) => api.put(`/bookings/${id}/payment`, paymentData),
  // Admin endpoints
  adminUpdateStatus: (id, status, cancellationReason) => api.put(`/bookings/${id}/adminstatus`, { status, cancellationReason }),
  adminRefund: (id) => api.put(`/bookings/${id}/refund`),
  getAdminStats: () => api.get('/bookings/admin/stats')
};

// Users API (admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
  updateVerification: (id, isVerified) => api.put(`/users/${id}/verify`, { isVerified }),
  updateActiveStatus: (id, isActive) => api.put(`/users/${id}/active`, { isActive }),
  getStats: () => api.get('/users/stats'),
  // Admin endpoints
  impersonate: (id) => api.post(`/users/${id}/impersonate`),
  resetPassword: (id, password) => api.put(`/users/${id}/resetpassword`, { password }),
  assignRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  getAdminStats: () => api.get('/users/admin/stats')
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

export default api;
