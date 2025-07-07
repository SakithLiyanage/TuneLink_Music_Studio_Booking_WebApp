const Artist = require('../models/Artist');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
exports.getArtists = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Artist.find(JSON.parse(queryStr)).populate('user', 'name avatar');

  // Search functionality
  if (req.query.search) {
    query = Artist.search(req.query.search);
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Artist.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const artists = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: artists.length,
    pagination,
    data: artists
  });
});

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Public
exports.getArtist = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id)
    .populate('user', 'name email avatar contact bio')
    .populate('ratings.user', 'name avatar');

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: artist
  });
});

// @desc    Create new artist
// @route   POST /api/artists
// @access  Private
exports.createArtist = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published artist
  const publishedArtist = await Artist.findOne({ user: req.user.id });

  if (publishedArtist) {
    return next(new ErrorResponse('User already has an artist profile', 400));
  }

  const artist = await Artist.create(req.body);

  res.status(201).json({
    success: true,
    data: artist
  });
});

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private
exports.updateArtist = asyncHandler(async (req, res, next) => {
  let artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is artist owner
  if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this artist`, 401));
  }

  artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: artist
  });
});

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private
exports.deleteArtist = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is artist owner
  if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this artist`, 401));
  }

  await artist.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload artist media
// @route   PUT /api/artists/:id/media
// @access  Private
exports.uploadArtistMedia = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is artist owner
  if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to upload media`, 401));
  }

  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Add file info to artist
  const fileData = {
    type: req.body.type || 'image',
    url: req.file.path,
    title: req.body.title,
    description: req.body.description
  };

  artist.mediaFiles.push(fileData);
  await artist.save();

  res.status(200).json({
    success: true,
    data: fileData
  });
});

// @desc    Add rating to artist
// @route   POST /api/artists/:id/ratings
// @access  Private
exports.addArtistRating = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  // Check if user already rated
  const existingRating = artist.ratings.find(
    rating => rating.user.toString() === req.user.id
  );

  if (existingRating) {
    return next(new ErrorResponse('User has already rated this artist', 400));
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
    data: rating
  });
});

// @desc    Get featured artists
// @route   GET /api/artists/featured
// @access  Public
exports.getFeaturedArtists = asyncHandler(async (req, res, next) => {
  const artists = await Artist.getFeatured();

  res.status(200).json({
    success: true,
    count: artists.length,
    data: artists
  });
});

// @desc    Search artists
// @route   GET /api/artists/search
// @access  Public
exports.searchArtists = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const artists = await Artist.search(q);

  res.status(200).json({
    success: true,
    count: artists.length,
    data: artists
  });
});

// @desc    Update artist availability
// @route   PUT /api/artists/:id/availability
// @access  Private
exports.updateArtistAvailability = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is artist owner
  if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update availability`, 401));
  }

  artist.availability = req.body.availability;
  await artist.save();

  res.status(200).json({
    success: true,
    data: artist.availability
  });
});

// @desc    Admin verify artist
// @route   PUT /api/artists/:id/verify
// @access  Private/Admin
exports.adminVerifyArtist = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }
  artist.isVerified = req.body.isVerified;
  await artist.save();
  res.status(200).json({ success: true, data: artist });
});

// @desc    Admin deactivate artist
// @route   PUT /api/artists/:id/active
// @access  Private/Admin
exports.adminDeactivateArtist = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }
  artist.isAvailableForHire = req.body.isAvailableForHire;
  await artist.save();
  res.status(200).json({ success: true, data: artist });
});

// @desc    Admin feature/unfeature artist
// @route   PUT /api/artists/:id/feature
// @access  Private/Admin
exports.adminFeatureArtist = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    return next(new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404));
  }
  artist.featured = req.body.featured;
  await artist.save();
  res.status(200).json({ success: true, data: artist });
});

// @desc    Get artist stats for dashboard
// @route   GET /api/artists/admin/stats
// @access  Private/Admin
exports.getArtistStats = asyncHandler(async (req, res, next) => {
  const totalArtists = await Artist.countDocuments();
  const verifiedArtists = await Artist.countDocuments({ isVerified: true });
  const featuredArtists = await Artist.countDocuments({ featured: true });
  const availableArtists = await Artist.countDocuments({ isAvailableForHire: true });
  res.status(200).json({
    success: true,
    data: {
      totalArtists,
      verifiedArtists,
      featuredArtists,
      availableArtists
    }
  });
});

// @desc    Admin get all artist reviews
// @route   GET /api/artists/admin/reviews
// @access  Private/Admin
exports.getAllArtistReviews = asyncHandler(async (req, res, next) => {
  const artists = await Artist.find({}, 'user ratings').populate('user', 'name');
  const reviews = [];
  artists.forEach(artist => {
    artist.ratings.forEach(rating => {
      reviews.push({
        artistId: artist._id,
        artistName: artist.user?.name,
        ...rating._doc
      });
    });
  });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Admin delete artist review
// @route   DELETE /api/artists/:artistId/reviews/:reviewId
// @access  Private/Admin
exports.deleteArtistReview = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.artistId);
  if (!artist) {
    return next(new ErrorResponse('Artist not found', 404));
  }
  artist.ratings = artist.ratings.filter(r => r._id.toString() !== req.params.reviewId);
  await artist.save();
  res.status(200).json({ success: true, message: 'Review deleted' });
});
