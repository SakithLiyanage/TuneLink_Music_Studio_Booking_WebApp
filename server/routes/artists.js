const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistsByGenre,
  getArtistsByInstrument,
  updateAvailability,
  addRating,
  uploadArtistMedia
} = require('../controllers/artists');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getArtists);

router.route('/:id')
  .get(getArtist);

router.route('/genre/:genre')
  .get(getArtistsByGenre);

router.route('/instrument/:instrument')
  .get(getArtistsByInstrument);

// Protected routes
router.use(protect);

router.route('/')
  .post(authorize('artist'), createArtist);

router.route('/:id')
  .put(authorize('artist', 'admin'), updateArtist)
  .delete(authorize('artist', 'admin'), deleteArtist);

router.route('/:id/availability')
  .put(authorize('artist'), updateAvailability);

router.route('/:id/ratings')
  .post(authorize('client'), addRating);

router.route('/:id/media')
  .post(authorize('artist'), uploadArtistMedia);

module.exports = router;
