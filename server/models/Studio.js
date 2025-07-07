const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  facilities: [{
    name: String,
    description: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  equipment: [{
    name: String,
    description: String,
    quantity: Number
  }],
  services: [{
    type: String,
    trim: true
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
  capacity: {
    type: Number,
    default: 1
  },
  amenities: [{
    type: String,
    trim: true
  }],
  policies: {
    cancellationPolicy: String,
    bookingPolicy: String,
    houseRules: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
studioSchema.index({ 'location.city': 1 });
studioSchema.index({ hourlyRate: 1 });
studioSchema.index({ averageRating: -1 });
studioSchema.index({ featured: 1 });
studioSchema.index({ isAvailableForHire: 1 });
studioSchema.index({ services: 1 });

// Virtual for full name
studioSchema.virtual('fullName').get(function() {
  return this.name;
});

// Calculate average rating before saving
studioSchema.pre('save', function(next) {
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

// Static method to get featured studios
studioSchema.statics.getFeatured = function() {
  return this.find({ featured: true, isAvailableForHire: true })
    .populate('user', 'name avatar')
    .sort({ averageRating: -1 });
};

// Static method to search studios
studioSchema.statics.search = function(query) {
  const searchQuery = {
    isAvailableForHire: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { services: { $in: [new RegExp(query, 'i')] } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  return this.find(searchQuery)
    .populate('user', 'name avatar')
    .sort({ averageRating: -1 });
};

module.exports = mongoose.model('Studio', studioSchema);
