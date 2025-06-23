const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instruments: [{
    type: String,
    required: true
  }],
  genres: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  portfolio: {
    website: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      soundcloud: String
    }
  },
  mediaFiles: [{
    type: String  // URLs to audio/video files
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      startTime: String,
      endTime: String
    }]
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailableForHire: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Calculate average rating before saving
artistSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = total / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Artist', artistSchema);
