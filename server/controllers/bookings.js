const Booking = require('../models/Booking');
const Artist = require('../models/Artist');
const Studio = require('../models/Studio');

// @desc      Get all bookings
// @route     GET /api/bookings
// @access    Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'client',
        select: 'name email'
      })
      .populate('artist')
      .populate('studio');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single booking
// @route     GET /api/bookings/:id
// @access    Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'client',
        select: 'name email'
      })
      .populate({
        path: 'artist',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate({
        path: 'studio',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner, artist, studio owner or admin
    if (
      booking.client._id.toString() !== req.user.id &&
      (booking.artist && booking.artist.user._id.toString() !== req.user.id) &&
      (booking.studio && booking.studio.user._id.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Create booking
// @route     POST /api/bookings
// @access    Private/Client
exports.createBooking = async (req, res, next) => {
  try {
    // Add client (user) to booking data
    req.body.client = req.user.id;

    // Validate booking type
    if (!['artist', 'studio'].includes(req.body.bookingType)) {
      return res.status(400).json({
        success: false,
        message: 'Booking type must be either artist or studio'
      });
    }

    // Validate required data exists for booking type
    if (req.body.bookingType === 'artist' && !req.body.artist) {
      return res.status(400).json({
        success: false,
        message: 'Artist ID is required for artist bookings'
      });
    }

    if (req.body.bookingType === 'studio' && !req.body.studio) {
      return res.status(400).json({
        success: false,
        message: 'Studio ID is required for studio bookings'
      });
    }

    // Create the booking
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update booking
// @route     PUT /api/bookings/:id
// @access    Private/Admin
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete booking
// @route     DELETE /api/bookings/:id
// @access    Private/Admin
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get logged in user's bookings
// @route     GET /api/bookings/me
// @access    Private
exports.getMyBookings = async (req, res, next) => {
  try {
    let bookings = [];

    if (req.user.role === 'client') {
      // Get client bookings
      bookings = await Booking.find({ client: req.user.id })
        .populate({
          path: 'artist',
          populate: {
            path: 'user',
            select: 'name'
          }
        })
        .populate({
          path: 'studio',
          select: 'name'
        });
    } else if (req.user.role === 'artist') {
      // Get artist's bookings
      const artist = await Artist.findOne({ user: req.user.id });
      
      if (!artist) {
        return res.status(404).json({
          success: false,
          message: 'Artist profile not found'
        });
      }
      
      bookings = await Booking.find({ 
        bookingType: 'artist', 
        artist: artist._id 
      }).populate({
        path: 'client',
        select: 'name email'
      });
    } else if (req.user.role === 'studio') {
      // Get studio's bookings
      const studio = await Studio.findOne({ user: req.user.id });
      
      if (!studio) {
        return res.status(404).json({
          success: false,
          message: 'Studio not found'
        });
      }
      
      bookings = await Booking.find({ 
        bookingType: 'studio', 
        studio: studio._id 
      }).populate({
        path: 'client',
        select: 'name email'
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get client bookings
// @route     GET /api/bookings/client
// @access    Private/Client
exports.getClientBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate({
        path: 'artist',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('studio');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get artist bookings
// @route     GET /api/bookings/artist
// @access    Private/Artist
exports.getArtistBookings = async (req, res, next) => {
  try {
    const artist = await Artist.findOne({ user: req.user.id });
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist profile not found'
      });
    }
    
    const bookings = await Booking.find({ 
      bookingType: 'artist', 
      artist: artist._id 
    }).populate({
      path: 'client',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get studio bookings
// @route     GET /api/bookings/studio
// @access    Private/Studio
exports.getStudioBookings = async (req, res, next) => {
  try {
    const studio = await Studio.findOne({ user: req.user.id });
    
    if (!studio) {
      return res.status(404).json({
        success: false,
        message: 'Studio not found'
      });
    }
    
    const bookings = await Booking.find({ 
      bookingType: 'studio', 
      studio: studio._id 
    }).populate({
      path: 'client',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update booking status
// @route     PUT /api/bookings/:id/status
// @access    Private/Artist or Studio or Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify authorization
    let isAuthorized = false;

    if (req.user.role === 'admin') {
      isAuthorized = true;
    } else if (req.user.role === 'artist' && booking.bookingType === 'artist') {
      const artist = await Artist.findOne({ user: req.user.id });
      isAuthorized = artist && booking.artist.toString() === artist._id.toString();
    } else if (req.user.role === 'studio' && booking.bookingType === 'studio') {
      const studio = await Studio.findOne({ user: req.user.id });
      isAuthorized = studio && booking.studio.toString() === studio._id.toString();
    }

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update payment status
// @route     PUT /api/bookings/:id/payment
// @access    Private/Client or Admin
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    if (!['pending', 'paid', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }
    
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.paymentStatus = paymentStatus;
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};
