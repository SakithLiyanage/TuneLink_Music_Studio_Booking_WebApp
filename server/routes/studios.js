const express = require('express');
const {
  getStudios,
  getStudio,
  createStudio,
  updateStudio,
  deleteStudio,
  uploadStudioImages,
  addStudioRating,
  getFeaturedStudios,
  searchStudios,
  updateStudioAvailability,
  adminVerifyStudio,
  adminDeactivateStudio,
  adminFeatureStudio,
  getStudioStats,
  getAllStudioReviews,
  deleteStudioReview
} = require('../controllers/studios');

const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getStudios);

router.route('/featured')
  .get(getFeaturedStudios);

router.route('/search')
  .get(searchStudios);

router.route('/admin/stats')
  .get(protect, authorize('admin'), getStudioStats);

router.route('/admin/reviews')
  .get(protect, authorize('admin'), getAllStudioReviews);

router.route('/:studioId/reviews/:reviewId')
  .delete(protect, authorize('admin'), deleteStudioReview);

router.route('/:id')
  .get(getStudio);

// Protected routes
router.use(protect);

router.route('/')
  .post(authorize('studio'), createStudio);

router.route('/:id')
  .put(checkOwnership('Studio'), updateStudio)
  .delete(checkOwnership('Studio'), deleteStudio);

router.route('/:id/images')
  .put(checkOwnership('Studio'), uploadStudioImages);

router.route('/:id/ratings')
  .post(authorize('client', 'admin'), addStudioRating);

router.route('/:id/availability')
  .put(checkOwnership('Studio'), updateStudioAvailability);

// Admin routes
router.route('/:id/verify')
  .put(authorize('admin'), adminVerifyStudio);

router.route('/:id/active')
  .put(authorize('admin'), adminDeactivateStudio);

router.route('/:id/feature')
  .put(authorize('admin'), adminFeatureStudio);

module.exports = router;
