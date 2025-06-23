const Artist = require('../models/Artist');
const User = require('../models/User');

// @desc      Get all artists
// @route     GET /api/artists
// @access    Public
exports.getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find().populate({
      path: 'user',
      select: 'name email avatar'
    });

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single artist
// @route     GET /api/artists/:id
// @access    Public
exports.getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).populate({
      path: 'user',
      select: 'name email avatar bio'
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create artist profile
// @route     POST /api/artists
// @access    Private/Artist
exports.createArtist = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if profile already exists
    const existingArtist = await Artist.findOne({ user: req.user.id });

    if (existingArtist) {
      return res.status(400).json({
        success: false,
        message: 'This user already has an artist profile'
      });
    }

    const artist = await Artist.create(req.body);

    res.status(201).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update artist profile
// @route     PUT /api/artists/:id
// @access    Private/Artist or Admin
exports.updateArtist = async (req, res, next) => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Make sure user is artist owner or admin
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete artist profile
// @route     DELETE /api/artists/:id
// @access    Private/Artist or Admin
exports.deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Make sure user is artist owner or admin
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    await artist.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get artists by genre
// @route     GET /api/artists/genre/:genre
// @access    Public
exports.getArtistsByGenre = async (req, res, next) => {
  try {
    const genre = req.params.genre;
    const artists = await Artist.find({ genres: genre }).populate({
      path: 'user',
      select: 'name email avatar'
    });

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get artists by instrument
// @route     GET /api/artists/instrument/:instrument
// @access    Public
exports.getArtistsByInstrument = async (req, res, next) => {
  try {
    const instrument = req.params.instrument;
    const artists = await Artist.find({ instruments: instrument }).populate({
      path: 'user',
      select: 'name email avatar'
    });

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update artist availability
// @route     PUT /api/artists/:id/availability
// @access    Private/Artist
exports.updateAvailability = async (req, res, next) => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Make sure user is artist owner
    if (artist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    artist.availability = req.body.availability;
    await artist.save();

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Add artist rating
// @route     POST /api/artists/:id/ratings
// @access    Private/Client
exports.addRating = async (req, res, next) => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Check if user already left a rating
    const alreadyRated = artist.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this artist'
      });
    }

    const rating = {
      user: req.user.id,
      rating: req.body.rating,
      review: req.body.review
    };

    artist.ratings.push(rating);
    await artist.save();

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Upload artist media
// @route     POST /api/artists/:id/media
// @access    Private/Artist
exports.uploadArtistMedia = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Make sure user is artist owner
    if (artist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // In a real implementation, upload to Cloudinary or similar service
    // and store the returned URLs
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Mock response for now
    artist.mediaFiles.push('https://example.com/media/demo.mp3');
    await artist.save();

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (err) {
    next(err);
  }
};
