const express = require('express');
const {
  getStudios,
  getStudio,
  createStudio,
  updateStudio,
  deleteStudio,
  getStudiosByCity,
  updateAvailability,
  addRating,
  uploadStudioImages
} = require('../controllers/studios');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getStudios);

router.route('/:id')
  .get(getStudio);

router.route('/city/:city')
  .get(getStudiosByCity);

// Protected routes
router.use(protect);

router.route('/')
  .post(authorize('studio'), createStudio);

router.route('/:id')
  .put(authorize('studio', 'admin'), updateStudio)
  .delete(authorize('studio', 'admin'), deleteStudio);

router.route('/:id/availability')
  .put(authorize('studio'), updateAvailability);

router.route('/:id/ratings')
  .post(authorize('client'), addRating);

router.route('/:id/images')
  .post(authorize('studio'), uploadStudioImages);

module.exports = router;
