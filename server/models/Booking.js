const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['artist', 'studio'],
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
  totalHours: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer'],
    default: 'cash'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Validate booking data
bookingSchema.pre('save', function(next) {
  if (this.bookingType === 'artist' && !this.artist) {
    return next(new Error('Artist ID is required for artist bookings'));
  }
  if (this.bookingType === 'studio' && !this.studio) {
    return next(new Error('Studio ID is required for studio bookings'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
