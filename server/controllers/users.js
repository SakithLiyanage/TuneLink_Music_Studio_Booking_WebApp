const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
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
  query = User.find(JSON.parse(queryStr));

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
  const total = await User.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const users = await query;

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
    count: users.length,
    pagination,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
exports.getUsersByRole = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: req.params.role })
    .select('-password')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Update user verification status
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
exports.updateUserVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  user.isVerified = req.body.isVerified;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user active status
// @route   PUT /api/users/:id/active
// @access  Private/Admin
exports.updateUserActiveStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  user.isActive = req.body.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const recentUsers = await User.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email role createdAt');

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      verifiedUsers,
      activeUsers,
      usersByRole,
      recentUsers
    }
  });
});

// @desc    Impersonate user (admin only)
// @route   POST /api/users/:id/impersonate
// @access  Private/Admin
exports.impersonateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  // Generate a JWT for the user
  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpire });
  res.status(200).json({ success: true, token });
});

// @desc    Admin reset user password
// @route   PUT /api/users/:id/resetpassword
// @access  Private/Admin
exports.adminResetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  if (!req.body.password || req.body.password.length < 6) {
    return next(new ErrorResponse('Password must be at least 6 characters', 400));
  }
  user.password = await bcrypt.hash(req.body.password, 10);
  await user.save();
  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

// @desc    Admin assign user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.assignUserRole = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  if (!req.body.role) {
    return next(new ErrorResponse('Role is required', 400));
  }
  user.role = req.body.role;
  await user.save();
  res.status(200).json({ success: true, data: user });
});

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalArtists = await User.countDocuments({ role: 'artist' });
  const totalStudios = await User.countDocuments({ role: 'studio' });
  const totalClients = await User.countDocuments({ role: 'client' });
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalArtists,
      totalStudios,
      totalClients,
      verifiedUsers,
      activeUsers
    }
  });
});
