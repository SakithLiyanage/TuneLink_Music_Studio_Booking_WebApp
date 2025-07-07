const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio'
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  services: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  paymentId: String,
  cancellationReason: String,
  cancellationDate: Date,
  completedAt: Date,
  rating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 1000
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookingSchema.index({ client: 1 });
bookingSchema.index({ artist: 1 });
bookingSchema.index({ studio: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'rating.rating': -1 });

// Virtual for booking type
bookingSchema.virtual('bookingType').get(function() {
  return this.artist ? 'artist' : 'studio';
});

// Virtual for isCompleted
bookingSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Virtual for isCancelled
bookingSchema.virtual('isCancelled').get(function() {
  return this.status === 'cancelled';
});

// Pre-save middleware to ensure either artist or studio is provided
bookingSchema.pre('save', function(next) {
  if (!this.artist && !this.studio) {
    return next(new Error('Either artist or studio must be provided'));
  }
  if (this.artist && this.studio) {
    return next(new Error('Cannot book both artist and studio simultaneously'));
  }
  next();
});

// Static method to get bookings by date range
bookingSchema.statics.getByDateRange = function(startDate, endDate, entityId, entityType) {
  const query = {
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };

  if (entityType === 'artist') {
    query.artist = entityId;
  } else if (entityType === 'studio') {
    query.studio = entityId;
  }

  return this.find(query)
    .populate('client', 'name email')
    .sort({ date: 1, startTime: 1 });
};

// Static method to check availability
bookingSchema.statics.checkAvailability = async function(date, startTime, endTime, entityId, entityType) {
  const query = {
    date: date,
    status: { $nin: ['cancelled'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };

  if (entityType === 'artist') {
    query.artist = entityId;
  } else if (entityType === 'studio') {
    query.studio = entityId;
  }

  const conflictingBookings = await this.find(query);
  return conflictingBookings.length === 0;
};

module.exports = mongoose.model('Booking', bookingSchema);
