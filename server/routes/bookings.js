const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  getMyBookings,
  getArtistBookings,
  getStudioBookings,
  adminUpdateBookingStatus,
  adminRefundBooking,
  getBookingStats
} = require('../controllers/bookings');

const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(authorize('admin'), getBookings)
  .post(authorize('client'), createBooking);

router.route('/me')
  .get(getMyBookings);

router.route('/artist')
  .get(authorize('artist'), getArtistBookings);

router.route('/studio')
  .get(authorize('studio'), getStudioBookings);

router.route('/admin/stats')
  .get(authorize('admin'), getBookingStats);

router.route('/:id')
  .get(checkOwnership('Booking'), getBooking)
  .put(checkOwnership('Booking'), updateBooking)
  .delete(checkOwnership('Booking'), deleteBooking);

router.route('/:id/status')
  .put(authorize('artist', 'studio', 'admin'), updateBookingStatus);

router.route('/:id/adminstatus')
  .put(authorize('admin'), adminUpdateBookingStatus);

router.route('/:id/refund')
  .put(authorize('admin'), adminRefundBooking);

module.exports = router;
