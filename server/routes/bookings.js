const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  getClientBookings,
  getArtistBookings,
  getStudioBookings,
  updateBookingStatus,
  updatePaymentStatus
} = require('../controllers/bookings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// General booking routes
router.route('/:id')
  .get(getBooking);

// Client routes
router.route('/')
  .post(authorize('client'), createBooking);

router.route('/me')
  .get(getMyBookings);

router.route('/client')
  .get(authorize('client'), getClientBookings);

// Artist routes
router.route('/artist')
  .get(authorize('artist'), getArtistBookings);

// Studio routes
router.route('/studio')
  .get(authorize('studio'), getStudioBookings);

// Status update routes
router.route('/:id/status')
  .put(authorize('artist', 'studio', 'admin'), updateBookingStatus);

router.route('/:id/payment')
  .put(authorize('client', 'admin'), updatePaymentStatus);

// Admin routes
router.route('/')
  .get(authorize('admin'), getBookings);

router.route('/:id')
  .put(authorize('admin'), updateBooking)
  .delete(authorize('admin'), deleteBooking);

module.exports = router;
