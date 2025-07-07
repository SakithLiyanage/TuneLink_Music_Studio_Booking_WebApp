const Booking = require('../models/Booking');
const Artist = require('../models/Artist');
const Studio = require('../models/Studio');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Booking.find(JSON.parse(queryStr))
    .populate('client', 'name email')
    .populate('artist', 'user hourlyRate')
    .populate('studio', 'name hourlyRate');

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
  const total = await Booking.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bookings = await query;

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
    count: bookings.length,
    pagination,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('client', 'name email contact')
    .populate('artist', 'user hourlyRate')
    .populate('studio', 'name hourlyRate');

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this booking`, 401));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.client = req.user.id;

  const { artistId, studioId, date, startTime, endTime, services, notes } = req.body;

  // Validate that either artist or studio is provided
  if (!artistId && !studioId) {
    return next(new ErrorResponse('Please provide either an artist or studio', 400));
  }

  // Check availability
  let entity;
  if (artistId) {
    entity = await Artist.findById(artistId);
    if (!entity) {
      return next(new ErrorResponse('Artist not found', 404));
    }
  } else if (studioId) {
    entity = await Studio.findById(studioId);
    if (!entity) {
      return next(new ErrorResponse('Studio not found', 404));
    }
  }

  // Calculate duration and total cost
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const duration = (end - start) / (1000 * 60 * 60); // hours
  const totalCost = duration * entity.hourlyRate;

  const booking = await Booking.create({
    client: req.user.id,
    artist: artistId,
    studio: studioId,
    date,
    startTime,
    endTime,
    duration,
    totalCost,
    services,
    notes,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 401));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this booking`, 401));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Only artist/studio owner or admin can update status
  const isOwner = (booking.artist && booking.artist.toString() === req.user.id) ||
                  (booking.studio && booking.studio.toString() === req.user.id);

  if (!isOwner && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update booking status`, 401));
  }

  booking.status = req.body.status;
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Admin update booking status (cancel/refund/complete)
// @route   PUT /api/bookings/:id/adminstatus
// @access  Private/Admin
exports.adminUpdateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }
  if (!req.body.status) {
    return next(new ErrorResponse('Status is required', 400));
  }
  booking.status = req.body.status;
  if (req.body.status === 'cancelled') {
    booking.cancellationReason = req.body.cancellationReason || 'Cancelled by admin';
    booking.cancellationDate = new Date();
  }
  if (req.body.status === 'completed') {
    booking.completedAt = new Date();
  }
  await booking.save();
  res.status(200).json({ success: true, data: booking });
});

// @desc    Admin refund booking
// @route   PUT /api/bookings/:id/refund
// @access  Private/Admin
exports.adminRefundBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }
  booking.paymentStatus = 'refunded';
  await booking.save();
  res.status(200).json({ success: true, data: booking });
});

// @desc    Get booking stats for dashboard
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
exports.getBookingStats = asyncHandler(async (req, res, next) => {
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalCost' } } }
  ]);
  res.status(200).json({
    success: true,
    data: {
      totalBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    }
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ client: req.user.id })
    .populate('artist', 'user hourlyRate')
    .populate('studio', 'name hourlyRate')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get artist bookings
// @route   GET /api/bookings/artist
// @access  Private
exports.getArtistBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ artist: req.user.id })
    .populate('client', 'name email contact')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get studio bookings
// @route   GET /api/bookings/studio
// @access  Private
exports.getStudioBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ studio: req.user.id })
    .populate('client', 'name email contact')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});
