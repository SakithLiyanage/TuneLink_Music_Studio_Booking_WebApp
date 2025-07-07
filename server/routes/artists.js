const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  uploadArtistMedia,
  addArtistRating,
  getFeaturedArtists,
  searchArtists,
  updateArtistAvailability,
  adminVerifyArtist,
  adminDeactivateArtist,
  adminFeatureArtist,
  getArtistStats,
  getAllArtistReviews,
  deleteArtistReview
} = require('../controllers/artists');

const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getArtists);

router.route('/featured')
  .get(getFeaturedArtists);

router.route('/search')
  .get(searchArtists);

router.route('/admin/stats')
  .get(protect, authorize('admin'), getArtistStats);

router.route('/admin/reviews')
  .get(protect, authorize('admin'), getAllArtistReviews);

router.route('/:artistId/reviews/:reviewId')
  .delete(protect, authorize('admin'), deleteArtistReview);

router.route('/:id')
  .get(getArtist);

// Protected routes
router.use(protect);

router.route('/')
  .post(authorize('artist'), createArtist);

router.route('/:id')
  .put(checkOwnership('Artist'), updateArtist)
  .delete(checkOwnership('Artist'), deleteArtist);

router.route('/:id/media')
  .put(checkOwnership('Artist'), uploadArtistMedia);

router.route('/:id/ratings')
  .post(authorize('client', 'admin'), addArtistRating);

router.route('/:id/availability')
  .put(checkOwnership('Artist'), updateArtistAvailability);

// Admin routes
router.route('/:id/verify')
  .put(authorize('admin'), adminVerifyArtist);

router.route('/:id/active')
  .put(authorize('admin'), adminDeactivateArtist);

router.route('/:id/feature')
  .put(authorize('admin'), adminFeatureArtist);

module.exports = router;
