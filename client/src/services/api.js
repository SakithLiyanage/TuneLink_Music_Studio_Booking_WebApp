import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
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

// Handle token expiration
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

// Artists API
export const artistsAPI = {
  getAll: (params) => api.get('/artists', { params }),
  getById: (id) => api.get(`/artists/${id}`),
  create: (artistData) => api.post('/artists', artistData),
  update: (id, artistData) => api.put(`/artists/${id}`, artistData),
  delete: (id) => api.delete(`/artists/${id}`),
  updateAvailability: (id, availabilityData) => api.put(`/artists/${id}/availability`, availabilityData),
  uploadMedia: (id, formData) => api.post(`/artists/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addRating: (id, ratingData) => api.post(`/artists/${id}/ratings`, ratingData)
};

// Studios API
export const studiosAPI = {
  getAll: (params) => api.get('/studios', { params }),
  getById: (id) => api.get(`/studios/${id}`),
  create: (studioData) => api.post('/studios', studioData),
  update: (id, studioData) => api.put(`/studios/${id}`, studioData),
  delete: (id) => api.delete(`/studios/${id}`),
  updateAvailability: (id, availabilityData) => api.put(`/studios/${id}/availability`, availabilityData),
  uploadImages: (id, formData) => api.post(`/studios/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addRating: (id, ratingData) => api.post(`/studios/${id}/ratings`, ratingData)
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
  updatePayment: (id, paymentData) => api.put(`/bookings/${id}/payment`, paymentData)
};

// Users API (admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

export default api;
