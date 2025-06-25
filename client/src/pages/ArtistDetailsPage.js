import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMusic, FiCalendar, FiStar, FiMapPin, FiCheckCircle,
  FiHeart, FiShare2, FiPlayCircle, FiHeadphones, FiMic
} from 'react-icons/fi';

import BookingCalendar from '../components/booking/BookingCalendar';
import ReviewSection from '../components/reviews/ReviewSection';
import ImageGallery from '../components/ui/ImageGallery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AudioSamplePlayer from '../components/artists/AudioSamplePlayer';

// Local ArtistCard component to prevent circular dependencies
const ArtistCard = ({ artist, index = 0 }) => {
  if (!artist) return null;

  return (
    <motion.div 
      className="bg-card rounded-2xl shadow-soft p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-6">
        <motion.div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-md">
          {artist.user?.name?.charAt(0)}
        </motion.div>
        
        <div>
          <h3 className="text-xl font-bold mb-1">{artist.user?.name}</h3>
          <div className="flex flex-wrap gap-2">
            {artist.instruments?.map((instrument, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
                {instrument}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-amber-500">
            <FiStar className="fill-current mr-1" />
            <span className="font-medium">{artist.averageRating?.toFixed(1)}</span>
          </div>
          <span className="text-primary-600 font-bold">
            Rs. {artist.hourlyRate?.toLocaleString()}/hr
          </span>
        </div>
      </div>
      
      <Link
        to={`/artists/${artist._id}`}
        className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

const ArtistDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        // In a real app, this would be an API call
        // For now, using mock data
        const mockArtist = {
          _id: id,
          user: {
            _id: 'user123',
            name: 'Rajiv Mendis',
            email: 'rajiv@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            phoneNumber: '+94 77 123 4567'
          },
          bio: "Multi-instrumentalist and music producer with over 10 years of experience in Sri Lankan music scene. Specializing in fusion of traditional Sri Lankan sounds with modern electronic production.",
          longDescription: `With a passion for blending traditional Sri Lankan music with contemporary styles, I've worked with both established and emerging artists across the country. 

My approach combines technical precision with creative innovation, helping artists develop their unique sound while maintaining the highest quality production standards.

I'm skilled in guitar, keyboard, tabla, and flute, and can also arrange strings and horns for your productions. My studio experience spans from indie projects to commercial film soundtracks.`,
          location: { 
            city: 'Colombo', 
            address: '45 Park Avenue, Colombo 5',
            coordinates: { lat: 6.9102, lng: 79.8622 }
          },
          hourlyRate: 2500,
          dailyRate: 15000,
          genres: ['Pop', 'Rock', 'Electronic', 'Folk', 'World'],
          instruments: ['Guitar', 'Keyboard', 'Vocals', 'Programming'],
          services: [
            'Session Musician', 
            'Music Production', 
            'Arrangement', 
            'Songwriting',
            'Mixing & Mastering'
          ],
          languages: ['English', 'Sinhala', 'Tamil'],
          images: [
            { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600' },
            { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600' },
            { url: 'https://images.unsplash.com/photo-1598387993240-14a6f69672ff?q=80&w=1600' }
          ],
          audioSamples: [
            { 
              id: 1, 
              title: 'Sri Lankan Beats', 
              genre: 'World/Electronic',
              url: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
              coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400'
            },
            { 
              id: 2, 
              title: 'Sunset Chill', 
              genre: 'Electronic',
              url: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
              coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400'
            },
            { 
              id: 3, 
              title: 'Mountain Dreams', 
              genre: 'Folk/Acoustic',
              url: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
              coverImage: 'https://images.unsplash.com/photo-1598387993240-14a6f69672ff?q=80&w=400'
            }
          ],
          averageRating: 4.8,
          reviewCount: 17,
          availability: [
            { day: 'Monday', slots: [{ startTime: '10:00', endTime: '18:00', isAvailable: true }] },
            { day: 'Tuesday', slots: [{ startTime: '10:00', endTime: '18:00', isAvailable: true }] },
            { day: 'Wednesday', slots: [{ startTime: '10:00', endTime: '18:00', isAvailable: true }] },
            { day: 'Thursday', slots: [{ startTime: '10:00', endTime: '18:00', isAvailable: true }] },
            { day: 'Friday', slots: [{ startTime: '10:00', endTime: '18:00', isAvailable: true }] },
            { day: 'Saturday', slots: [{ startTime: '12:00', endTime: '20:00', isAvailable: true }] },
            { day: 'Sunday', slots: [{ startTime: '00:00', endTime: '00:00', isAvailable: false }] },
          ],
          experience: [
            {
              title: "Lead Guitarist - Serendib Band",
              years: "2018-Present",
              description: "Performing at venues across Sri Lanka and international festivals"
            },
            {
              title: "Music Producer - Sunrise Studios",
              years: "2015-2018",
              description: "Produced over 20 albums for local and international artists"
            },
            {
              title: "Session Musician",
              years: "2012-Present",
              description: "Worked on over 50 recording projects"
            }
          ],
          reviews: [
            {
              _id: 'rev1',
              user: { name: 'Amal Fernando', image: 'https://randomuser.me/api/portraits/men/44.jpg' },
              rating: 5,
              date: '2023-10-15',
              text: 'Rajiv is an outstanding musician! His guitar work on my album was exactly what I needed.'
            },
            {
              _id: 'rev2',
              user: { name: 'Priya Jayanetti', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
              rating: 5,
              date: '2023-09-28',
              text: 'Incredible talent and very professional. Rajiv helped transform my rough demo into a polished track.'
            },
            {
              _id: 'rev3',
              user: { name: 'Malik Gunasekera', image: 'https://randomuser.me/api/portraits/men/65.jpg' },
              rating: 4,
              date: '2023-08-10',
              text: 'Great session musician who brings creative ideas to the table. Would definitely work with again.'
            }
          ]
        };
        
        setArtist(mockArtist);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist details:', error);
        setLoading(false);
      }
    };
    
    fetchArtistDetails();
  }, [id]);
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, make an API call to save this preference
  };

  const shareArtist = () => {
    if (navigator.share) {
      navigator.share({
        title: `TuneLink - ${artist?.user?.name}`,
        text: `Check out ${artist?.user?.name} on TuneLink`,
        url: window.location.href
      })
      .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!artist) {
    return <div className="container mx-auto px-4 py-16">Artist not found</div>;
  }

  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Artist Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex">
              <div className="mr-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={artist.user.avatar} 
                    alt={artist.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{artist.user.name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <FiMapPin className="mr-1" />
                  <span>{artist.location.city}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {artist.instruments.slice(0, 3).map((instrument, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      <FiMusic className="mr-1" size={12} />
                      {instrument}
                    </span>
                  ))}
                  {artist.instruments.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{artist.instruments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                }`}
                onClick={toggleLike}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart className={isLiked ? 'fill-red-500' : ''} />
              </motion.button>
              <motion.button 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                onClick={shareArtist}
                whileTap={{ scale: 0.9 }}
              >
                <FiShare2 />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center mt-3">
            <div className="flex items-center text-amber-500">
              <FiStar className="fill-current mr-1" />
              <span className="font-medium">{artist.averageRating}</span>
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{artist.reviewCount} reviews</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {['overview', 'music', 'reviews', 'booking'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors capitalize whitespace-nowrap ${
                  activeSection === section
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeSection === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About {artist.user.name}</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p>{artist.longDescription}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Experience</h2>
                    <div className="space-y-4">
                      {artist.experience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-lg">{exp.title}</h3>
                            <span className="text-primary-600 font-medium">{exp.years}</span>
                          </div>
                          <p className="text-gray-600">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                      {artist.services.map((service, index) => (
                        <div key={index} className="flex items-center">
                          <FiCheckCircle className="mr-2 text-accent-500" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Images</h2>
                    <div className="aspect-video md:aspect-auto md:h-80 w-full">
                      <ImageGallery images={artist.images} />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Genres</h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.map((genre, index) => (
                        <span key={index} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'music' && (
                <motion.div 
                  key="music"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-semibold mb-4">Audio Samples</h2>
                  <div className="space-y-4">
                    {artist.audioSamples.map((sample) => (
                      <AudioSamplePlayer key={sample.id} sample={sample} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === 'reviews' && (
                <motion.div 
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewSection 
                    reviews={artist.reviews} 
                    averageRating={artist.averageRating} 
                    reviewCount={artist.reviewCount}
                    entityType="artist"
                    entityId={artist._id}
                  />
                </motion.div>
              )}

              {activeSection === 'booking' && (
                <motion.div 
                  key="booking"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden" // Only show on mobile, desktop has sidebar
                >
                  <h2 className="text-2xl font-semibold mb-4">Book {artist.user.name}</h2>
                  <BookingCalendar
                    entityId={artist._id}
                    entityType="artist"
                    baseRate={artist.hourlyRate}
                    availability={artist.availability}
                    onComplete={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Sticky Booking Widget */}
          <div className="lg:relative lg:block">
            <div className="lg:sticky lg:top-28">
              {activeSection !== 'booking' && (
                <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-2xl font-bold text-primary-600">
                      <span>Rs. {artist.hourlyRate.toLocaleString()}</span>
                      <span className="text-gray-500 text-base font-normal">/hour</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <FiStar className="mr-1 fill-current" />
                      <span className="font-medium">{artist.averageRating}</span>
                    </div>
                  </div>
                  
                  <BookingCalendar
                    entityId={artist._id}
                    entityType="artist"
                    baseRate={artist.hourlyRate}
                    availability={artist.availability}
                    onComplete={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Artists */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Similar Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Here we could map through related artists */}
            {[1, 2, 3].map((index) => (
              <ArtistCard key={index} artist={{
                _id: `sim${index}`,
                user: { name: `Similar Artist ${index}` },
                instruments: ['Guitar', 'Vocals'],
                hourlyRate: 2200 + (index * 300),
                averageRating: 4.5 + (index * 0.1)
              }} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailsPage;
