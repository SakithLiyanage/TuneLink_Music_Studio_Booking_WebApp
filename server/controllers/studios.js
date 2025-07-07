const Studio = require('../models/Studio');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all studios
// @route   GET /api/studios
// @access  Public
exports.getStudios = asyncHandler(async (req, res, next) => {
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
  query = Studio.find(JSON.parse(queryStr)).populate('user', 'name avatar');

  // Search functionality
  if (req.query.search) {
    query = Studio.search(req.query.search);
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
  const total = await Studio.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const studios = await query;

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
    count: studios.length,
    pagination,
    data: studios
  });
});

// @desc    Get single studio
// @route   GET /api/studios/:id
// @access  Public
exports.getStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id)
    .populate('user', 'name email avatar contact bio')
    .populate('ratings.user', 'name avatar');

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: studio
  });
});

// @desc    Create new studio
// @route   POST /api/studios
// @access  Private
exports.createStudio = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published studio
  const publishedStudio = await Studio.findOne({ user: req.user.id });

  if (publishedStudio) {
    return next(new ErrorResponse('User already has a studio profile', 400));
  }

  const studio = await Studio.create(req.body);

  res.status(201).json({
    success: true,
    data: studio
  });
});

// @desc    Update studio
// @route   PUT /api/studios/:id
// @access  Private
exports.updateStudio = asyncHandler(async (req, res, next) => {
  let studio = await Studio.findById(req.params.id);

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is studio owner
  if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this studio`, 401));
  }

  studio = await Studio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: studio
  });
});

// @desc    Delete studio
// @route   DELETE /api/studios/:id
// @access  Private
exports.deleteStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is studio owner
  if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this studio`, 401));
  }

  await studio.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload studio images
// @route   PUT /api/studios/:id/images
// @access  Private
exports.uploadStudioImages = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is studio owner
  if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to upload images`, 401));
  }

  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Add file info to studio
  const imageData = {
    url: req.file.path,
    caption: req.body.caption,
    isPrimary: req.body.isPrimary || false
  };

  studio.images.push(imageData);
  await studio.save();

  res.status(200).json({
    success: true,
    data: imageData
  });
});

// @desc    Add rating to studio
// @route   POST /api/studios/:id/ratings
// @access  Private
exports.addStudioRating = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  // Check if user already rated
  const existingRating = studio.ratings.find(
    rating => rating.user.toString() === req.user.id
  );

  if (existingRating) {
    return next(new ErrorResponse('User has already rated this studio', 400));
  }

  const rating = {
    user: req.user.id,
    rating: req.body.rating,
    review: req.body.review
  };

  studio.ratings.push(rating);
  await studio.save();

  res.status(200).json({
    success: true,
    data: rating
  });
});

// @desc    Get featured studios
// @route   GET /api/studios/featured
// @access  Public
exports.getFeaturedStudios = asyncHandler(async (req, res, next) => {
  const studios = await Studio.getFeatured();

  res.status(200).json({
    success: true,
    count: studios.length,
    data: studios
  });
});

// @desc    Search studios
// @route   GET /api/studios/search
// @access  Public
exports.searchStudios = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const studios = await Studio.search(q);

  res.status(200).json({
    success: true,
    count: studios.length,
    data: studios
  });
});

// @desc    Update studio availability
// @route   PUT /api/studios/:id/availability
// @access  Private
exports.updateStudioAvailability = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);

  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is studio owner
  if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update availability`, 401));
  }

  studio.availability = req.body.availability;
  await studio.save();

  res.status(200).json({
    success: true,
    data: studio.availability
  });
});

// @desc    Admin verify studio
// @route   PUT /api/studios/:id/verify
// @access  Private/Admin
exports.adminVerifyStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);
  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }
  studio.isVerified = req.body.isVerified;
  await studio.save();
  res.status(200).json({ success: true, data: studio });
});

// @desc    Admin deactivate studio
// @route   PUT /api/studios/:id/active
// @access  Private/Admin
exports.adminDeactivateStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);
  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }
  studio.isAvailableForHire = req.body.isAvailableForHire;
  await studio.save();
  res.status(200).json({ success: true, data: studio });
});

// @desc    Admin feature/unfeature studio
// @route   PUT /api/studios/:id/feature
// @access  Private/Admin
exports.adminFeatureStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);
  if (!studio) {
    return next(new ErrorResponse(`Studio not found with id of ${req.params.id}`, 404));
  }
  studio.featured = req.body.featured;
  await studio.save();
  res.status(200).json({ success: true, data: studio });
});

// @desc    Get studio stats for dashboard
// @route   GET /api/studios/admin/stats
// @access  Private/Admin
exports.getStudioStats = asyncHandler(async (req, res, next) => {
  const totalStudios = await Studio.countDocuments();
  const verifiedStudios = await Studio.countDocuments({ isVerified: true });
  const featuredStudios = await Studio.countDocuments({ featured: true });
  const availableStudios = await Studio.countDocuments({ isAvailableForHire: true });
  res.status(200).json({
    success: true,
    data: {
      totalStudios,
      verifiedStudios,
      featuredStudios,
      availableStudios
    }
  });
});

// @desc    Admin get all studio reviews
// @route   GET /api/studios/admin/reviews
// @access  Private/Admin
exports.getAllStudioReviews = asyncHandler(async (req, res, next) => {
  const studios = await Studio.find({}, 'name ratings').populate('user', 'name');
  const reviews = [];
  studios.forEach(studio => {
    studio.ratings.forEach(rating => {
      reviews.push({
        studioId: studio._id,
        studioName: studio.name,
        ...rating._doc
      });
    });
  });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Admin delete studio review
// @route   DELETE /api/studios/:studioId/reviews/:reviewId
// @access  Private/Admin
exports.deleteStudioReview = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.studioId);
  if (!studio) {
    return next(new ErrorResponse('Studio not found', 404));
  }
  studio.ratings = studio.ratings.filter(r => r._id.toString() !== req.params.reviewId);
  await studio.save();
  res.status(200).json({ success: true, message: 'Review deleted' });
});
