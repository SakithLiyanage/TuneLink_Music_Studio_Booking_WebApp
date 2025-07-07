const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  instruments: [{
    type: String,
    required: true,
    trim: true
  }],
  genres: [{
    type: String,
    trim: true
  }],
  experience: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    years: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  services: [{
    type: String,
    trim: true
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  longDescription: {
    type: String,
    default: ''
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  portfolio: {
    website: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      soundcloud: String,
      twitter: String
    }
  },
  mediaFiles: [{
    type: {
      type: String,
      enum: ['audio', 'video', 'image'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: String,
    description: String,
    duration: Number // for audio/video files
  }],
  audioSamples: [{
    id: String,
    title: String,
    url: String,
    duration: Number,
    description: String
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    }]
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      maxlength: 1000
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
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
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  equipment: [{
    name: String,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    description: String
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
artistSchema.index({ 'location.city': 1 });
artistSchema.index({ instruments: 1 });
artistSchema.index({ genres: 1 });
artistSchema.index({ hourlyRate: 1 });
artistSchema.index({ averageRating: -1 });
artistSchema.index({ featured: 1 });
artistSchema.index({ isAvailableForHire: 1 });

// Virtual for full name
artistSchema.virtual('fullName').get(function() {
  return this.user ? this.user.name : '';
});

// Calculate average rating before saving
artistSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
    this.reviewCount = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
  next();
});

// Static method to get featured artists
artistSchema.statics.getFeatured = function() {
  return this.find({ featured: true, isAvailableForHire: true })
    .populate('user', 'name avatar')
    .sort({ averageRating: -1 });
};

// Static method to search artists
artistSchema.statics.search = function(query) {
  const searchQuery = {
    isAvailableForHire: true,
    $or: [
      { 'user.name': { $regex: query, $options: 'i' } },
      { instruments: { $in: [new RegExp(query, 'i')] } },
      { genres: { $in: [new RegExp(query, 'i')] } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  return this.find(searchQuery)
    .populate('user', 'name avatar')
    .sort({ averageRating: -1 });
};

module.exports = mongoose.model('Artist', artistSchema);
