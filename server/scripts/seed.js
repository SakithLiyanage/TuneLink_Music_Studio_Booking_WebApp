const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Studio = require('../models/Studio');
const Booking = require('../models/Booking');
const config = require('../config/config');

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Artist.deleteMany();
    await Studio.deleteMany();
    await Booking.deleteMany();

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tunelink.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        contact: {
          phone: '+94 71 123 4567',
          address: '123 Main St',
          city: 'Colombo'
        },
        bio: 'Music enthusiast and event organizer',
        isVerified: true
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'artist',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        contact: {
          phone: '+94 72 234 5678',
          address: '456 Oak Ave',
          city: 'Kandy'
        },
        bio: 'Professional guitarist with 10+ years experience',
        isVerified: true
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'artist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        contact: {
          phone: '+94 73 345 6789',
          address: '789 Pine Rd',
          city: 'Galle'
        },
        bio: 'Drummer and percussion specialist',
        isVerified: true
      },
      {
        name: 'Studio One',
        email: 'studio1@example.com',
        password: 'password123',
        role: 'studio',
        avatar: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=150&h=150&fit=crop',
        contact: {
          phone: '+94 74 456 7890',
          address: '321 Studio St',
          city: 'Colombo'
        },
        bio: 'Professional recording studio',
        isVerified: true
      }
    ]);

    console.log('👥 Created users');

    // Create sample artists
    const artists = await Artist.create([
      {
        user: users[1]._id, // Sarah Wilson
        instruments: ['Guitar', 'Vocals', 'Piano'],
        genres: ['Rock', 'Pop', 'Folk'],
        experience: [
          {
            title: 'Lead Guitarist',
            years: '5 years',
            description: 'Performed with various bands across Sri Lanka'
          },
          {
            title: 'Session Musician',
            years: '3 years',
            description: 'Studio recording and live performances'
          }
        ],
        services: ['Live Performance', 'Studio Recording', 'Music Lessons', 'Event Entertainment'],
        hourlyRate: 2500,
        longDescription: 'Professional guitarist with over 10 years of experience in live performances and studio recordings. Specializes in rock, pop, and folk music. Available for weddings, corporate events, and private parties.',
        location: {
          city: 'Kandy',
          address: '456 Oak Avenue, Kandy'
        },
        portfolio: {
          website: 'https://sarahwilson.com',
          socialLinks: {
            instagram: '@sarahwilsonmusic',
            youtube: 'Sarah Wilson Music'
          }
        },
        audioSamples: [
          {
            id: 'sample1',
            title: 'Acoustic Cover',
            url: 'https://example.com/audio/sample1.mp3',
            duration: 180,
            description: 'Acoustic guitar cover of popular songs'
          }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
            caption: 'Live performance at Colombo Music Festival',
            isPrimary: true
          }
        ],
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '12:00' },
              { startTime: '14:00', endTime: '18:00' }
            ]
          },
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '12:00' },
              { startTime: '14:00', endTime: '18:00' }
            ]
          }
        ],
        averageRating: 4.8,
        reviewCount: 12,
        isVerified: true,
        featured: true,
        tags: ['Professional', 'Experienced', 'Reliable'],
        languages: ['English', 'Sinhala']
      },
      {
        user: users[2]._id, // Mike Johnson
        instruments: ['Drums', 'Percussion', 'Djembe'],
        genres: ['Jazz', 'Fusion', 'World Music'],
        experience: [
          {
            title: 'Drummer',
            years: '8 years',
            description: 'Professional drummer with jazz and fusion experience'
          }
        ],
        services: ['Live Performance', 'Studio Recording', 'Drum Lessons', 'Percussion Workshops'],
        hourlyRate: 3000,
        longDescription: 'Professional drummer and percussionist with extensive experience in jazz, fusion, and world music. Available for studio sessions, live performances, and educational workshops.',
        location: {
          city: 'Galle',
          address: '789 Pine Road, Galle'
        },
        portfolio: {
          socialLinks: {
            instagram: '@mikejohnsondrums',
            youtube: 'Mike Johnson Drums'
          }
        },
        audioSamples: [
          {
            id: 'sample2',
            title: 'Jazz Fusion',
            url: 'https://example.com/audio/sample2.mp3',
            duration: 240,
            description: 'Original jazz fusion composition'
          }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=600&fit=crop',
            caption: 'Studio session at Galle Music Studio',
            isPrimary: true
          }
        ],
        availability: [
          {
            day: 'Wednesday',
            slots: [
              { startTime: '10:00', endTime: '14:00' },
              { startTime: '16:00', endTime: '20:00' }
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '10:00', endTime: '14:00' },
              { startTime: '16:00', endTime: '20:00' }
            ]
          }
        ],
        averageRating: 4.6,
        reviewCount: 8,
        isVerified: true,
        featured: true,
        tags: ['Jazz', 'Fusion', 'Percussion'],
        languages: ['English', 'Sinhala']
      }
    ]);

    console.log('🎵 Created artists');

    // Create sample studios
    const studios = await Studio.create([
      {
        user: users[3]._id, // Studio One
        name: 'Studio One Recording',
        description: 'Professional recording studio with state-of-the-art equipment',
        longDescription: 'Studio One is a premier recording facility located in the heart of Colombo. We offer professional recording services for musicians, bands, and voice-over artists. Our studio features high-end equipment and experienced engineers.',
        location: {
          city: 'Colombo',
          address: '321 Studio Street, Colombo 03'
        },
        contact: {
          phone: '+94 74 456 7890',
          email: 'info@studioone.com',
          website: 'https://studioone.com'
        },
        hourlyRate: 5000,
        facilities: [
          {
            name: 'Main Recording Room',
            description: 'Large recording space with acoustic treatment',
            available: true
          },
          {
            name: 'Vocal Booth',
            description: 'Isolated vocal recording booth',
            available: true
          },
          {
            name: 'Control Room',
            description: 'Professional mixing and mastering setup',
            available: true
          }
        ],
        equipment: [
          {
            name: 'Pro Tools HD',
            description: 'Professional DAW setup',
            quantity: 1
          },
          {
            name: 'Neumann U87',
            description: 'Professional condenser microphone',
            quantity: 2
          },
          {
            name: 'Yamaha NS10',
            description: 'Studio monitors',
            quantity: 1
          }
        ],
        services: ['Recording', 'Mixing', 'Mastering', 'Voice-over', 'Podcast Recording'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&h=600&fit=crop',
            caption: 'Main recording room',
            isPrimary: true
          }
        ],
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '18:00' }
            ]
          },
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '18:00' }
            ]
          }
        ],
        averageRating: 4.9,
        reviewCount: 15,
        isVerified: true,
        featured: true,
        tags: ['Professional', 'High-end', 'Experienced'],
        capacity: 10,
        amenities: ['Parking', 'WiFi', 'Refreshments', 'Waiting Area'],
        policies: {
          cancellationPolicy: '24-hour cancellation notice required',
          bookingPolicy: 'Minimum 2-hour booking',
          houseRules: 'No smoking, food allowed in designated areas only'
        }
      }
    ]);

    console.log('🎙️ Created studios');

    // Create sample bookings
    const bookings = await Booking.create([
      {
        client: users[0]._id, // John Doe
        artist: artists[0]._id, // Sarah Wilson
        date: new Date('2024-02-15'),
        startTime: '14:00',
        endTime: '16:00',
        duration: 2,
        totalCost: 5000,
        services: ['Live Performance'],
        notes: 'Wedding ceremony at Grand Hotel',
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        client: users[0]._id, // John Doe
        studio: studios[0]._id, // Studio One
        date: new Date('2024-02-20'),
        startTime: '10:00',
        endTime: '14:00',
        duration: 4,
        totalCost: 20000,
        services: ['Recording', 'Mixing'],
        notes: 'Band recording session',
        status: 'pending',
        paymentStatus: 'pending'
      }
    ]);

    console.log('📅 Created bookings');

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${users.length} users, ${artists.length} artists, ${studios.length} studios, and ${bookings.length} bookings`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 