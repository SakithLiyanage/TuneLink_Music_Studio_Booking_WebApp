const Studio = require('../models/Studio');
const User = require('../models/User');

// @desc      Get all studios
// @route     GET /api/studios
// @access    Public
exports.getStudios = async (req, res, next) => {
  try {
    const studios = await Studio.find().populate({
      path: 'user',
      select: 'name email avatar'
    });

    res.status(200).json({
      success: true,
      count: studios.length,
      data: studios
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single studio
// @route     GET /api/studios/:id
// @access    Public
exports.getStudio = async (req, res, next) => {
  try {
    const studio = await Studio.findById(req.params.id).populate({
      path: 'user',
      select: 'name email avatar'
    });

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    res.status(200).json({
      success: true,
      data: studio
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create studio
// @route     POST /api/studios
// @access    Private/Studio
exports.createStudio = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if user already has a studio
    const existingStudio = await Studio.findOne({ user: req.user.id });

    if (existingStudio) {
      return res.status(400).json({
        success: false,
        message: 'This user already has a studio registered'
      });
    }

    const studio = await Studio.create(req.body);

    res.status(201).json({
      success: true,
      data: studio
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update studio
// @route     PUT /api/studios/:id
// @access    Private/Studio or Admin
exports.updateStudio = async (req, res, next) => {
  try {
    let studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    // Make sure user is studio owner or admin
    if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this studio'
      });
    }

    studio = await Studio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: studio
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete studio
// @route     DELETE /api/studios/:id
// @access    Private/Studio or Admin
exports.deleteStudio = async (req, res, next) => {
  try {
    const studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    // Make sure user is studio owner or admin
    if (studio.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this studio'
      });
    }

    await studio.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get studios by city
// @route     GET /api/studios/city/:city
// @access    Public
exports.getStudiosByCity = async (req, res, next) => {
  try {
    const city = req.params.city;
    const studios = await Studio.find({ 'location.city': city }).populate({
      path: 'user',
      select: 'name email avatar'
    });

    res.status(200).json({
      success: true,
      count: studios.length,
      data: studios
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update studio availability
// @route     PUT /api/studios/:id/availability
// @access    Private/Studio
exports.updateAvailability = async (req, res, next) => {
  try {
    let studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    // Make sure user is studio owner
    if (studio.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this studio'
      });
    }

    studio.availability = req.body.availability;
    await studio.save();

    res.status(200).json({
      success: true,
      data: studio
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Add studio rating
// @route     POST /api/studios/:id/ratings
// @access    Private/Client
exports.addRating = async (req, res, next) => {
  try {
    let studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    // Check if user already left a rating
    const alreadyRated = studio.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this studio'
      });
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
      data: studio
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Upload studio images
// @route     POST /api/studios/:id/images
// @access    Private/Studio
exports.uploadStudioImages = async (req, res, next) => {
  try {
    const studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }

    // Make sure user is studio owner
    if (studio.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this studio'
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
    const image = {
      url: 'https://example.com/images/demo.jpg',
      caption: req.body.caption || 'Studio image'
    };

    studio.images.push(image);
    await studio.save();

    res.status(200).json({
      success: true,
      data: studio
    });
  } catch (err) {
    next(err);
  }
};
