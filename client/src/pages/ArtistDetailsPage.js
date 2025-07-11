import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMusic, FiCalendar, FiStar, FiMapPin, FiCheckCircle,
  FiHeart, FiShare2, FiPlayCircle, FiHeadphones, FiMic, FiArrowLeft
} from 'react-icons/fi';

import BookingCalendar from '../components/booking/BookingCalendar';
import ReviewSection from '../components/reviews/ReviewSection';
import ImageGallery from '../components/ui/ImageGallery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AudioSamplePlayer from '../components/artists/AudioSamplePlayer';
import { artistsAPI } from '../services/api';
import { bookingsAPI } from '../services/api';
import WaveDivider from '../components/ui/WaveDivider';

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
  
  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Add a function to refresh artist details
  const refreshArtist = async () => {
    setLoading(true);
    try {
      const { data } = await artistsAPI.getById(id);
      setArtist(data.data);
    } catch (error) {
      setArtist(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      try {
        const { data } = await artistsAPI.getById(id);
        setArtist(data.data);
      } catch (error) {
        console.error('Error fetching artist details:', error);
        setArtist(null);
      }
      setLoading(false);
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
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/artists" 
          className="inline-flex items-center text-primary-700 font-bold mb-8 group text-lg hover:underline hover:text-accent-600 transition-all"
        >
          <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform text-xl" /> 
          Back to Artists
        </Link>
        {/* Artist Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-6">
              <motion.div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-glass" whileHover={{ scale: 1.05, rotate: 2 }}>
                <img 
                  src={artist.user.avatar} 
                  alt={artist.user.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2">{artist.user.name}</h1>
                <div className="flex items-center mb-3 text-dark/60">
                  <FiMapPin className="mr-2 text-primary-500" />
                  <span className="font-medium">{artist.location.city}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {artist.instruments.slice(0, 3).map((instrument, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-50/80 text-primary-700 border border-primary-100">
                      <FiMusic className="mr-2" size={14} />
                      {instrument}
                    </span>
                  ))}
                  {artist.instruments.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-50/80 text-gray-700 border border-gray-200">
                      +{artist.instruments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button 
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-glass border border-primary-100 ${
                  isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-500'
                }`}
                onClick={toggleLike}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
              >
                <FiHeart className={isLiked ? 'fill-red-500' : ''} size={20} />
              </motion.button>
              <motion.button 
                className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center text-gray-500 shadow-glass border border-primary-100"
                onClick={shareArtist}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
              >
                <FiShare2 size={20} />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-amber-500">
              <FiStar className="fill-current mr-2" size={20} />
              <span className="font-bold text-lg">{artist.averageRating}</span>
            </div>
            <span className="mx-3 text-gray-400">•</span>
            <span className="text-dark/60 font-medium">{artist.reviewCount} reviews</span>
          </div>
        </motion.div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <motion.div className="bg-glass/80 rounded-2xl p-1 mb-8 border border-primary-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <nav className="flex space-x-1">
                {['overview', 'music', 'reviews', 'booking'].map((section) => (
                  <motion.button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 capitalize ${
                      activeSection === section
                        ? 'bg-primary-700 text-white shadow-glass'
                        : 'text-dark/70 hover:text-primary-700 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.04, backgroundColor: '#f3f4f6' }}
                  >
                    {section}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
            {/* Content sections */}
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
                  <div className="bg-glass/80 rounded-3xl p-8 border border-primary-100">
                    <h2 className="text-3xl font-bold mb-6 text-primary-700">About {artist.user.name}</h2>
                    <div className="prose prose-lg max-w-none text-dark/70">
                      <p className="text-lg leading-relaxed">{artist.longDescription}</p>
                    </div>
                  </div>
                  
                  <div className="bg-glass/80 rounded-3xl p-8 border border-primary-100">
                    <h2 className="text-3xl font-bold mb-6 text-primary-700">Experience</h2>
                    <div className="space-y-4">
                      {artist.experience.map((exp, index) => (
                        <div key={index} className="bg-white/80 rounded-2xl p-6 border border-primary-50">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-primary-700">{exp.title}</h3>
                            <span className="text-accent-600 font-semibold bg-accent-50 px-3 py-1 rounded-full text-sm">{exp.years}</span>
                          </div>
                          <p className="text-dark/70">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-glass/80 rounded-3xl p-8 border border-primary-100">
                    <h2 className="text-3xl font-bold mb-6 text-primary-700">Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {artist.services.map((service, index) => (
                        <div key={index} className="flex items-center bg-white/80 rounded-xl p-4 border border-primary-50">
                          <FiCheckCircle className="mr-3 text-accent-500" size={20} />
                          <span className="font-semibold text-dark">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-glass/80 rounded-3xl p-8 border border-primary-100">
                    <h2 className="text-3xl font-bold mb-6 text-primary-700">Images</h2>
                    <div className="aspect-video md:aspect-auto md:h-80 w-full rounded-2xl overflow-hidden">
                      <ImageGallery images={artist.images} />
                    </div>
                  </div>
                  
                  <div className="bg-glass/80 rounded-3xl p-8 border border-primary-100">
                    <h2 className="text-3xl font-bold mb-6 text-primary-700">Genres</h2>
                    <div className="flex flex-wrap gap-3">
                      {artist.genres.map((genre, index) => (
                        <span key={index} className="px-4 py-2 bg-primary-50/80 text-primary-700 rounded-full text-sm font-semibold border border-primary-100">
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
                  className="bg-glass/80 rounded-3xl p-8 border border-primary-100"
                >
                  <h2 className="text-3xl font-bold mb-6 text-primary-700">Audio Samples</h2>
                  <div className="space-y-6">
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
                  className="bg-glass/80 rounded-3xl p-8 border border-primary-100"
                >
                  <ReviewSection 
                    reviews={artist.reviews} 
                    averageRating={artist.averageRating} 
                    reviewCount={artist.reviewCount}
                    entityType="artist"
                    entityId={artist._id}
                    onReviewSubmit={refreshArtist}
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
                  className="lg:hidden bg-glass/80 rounded-3xl p-8 border border-primary-100"
                >
                  <h2 className="text-3xl font-bold mb-6 text-primary-700">Book {artist.user.name}</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setBookingLoading(true);
                    setBookingError('');
                    try {
                      const res = await bookingsAPI.create({
                        artistId: artist._id,
                        date: bookingDate,
                        startTime: bookingStart,
                        endTime: bookingEnd,
                        duration: (parseInt(bookingEnd) - parseInt(bookingStart)) || 1,
                        totalCost: artist.hourlyRate,
                        services: [],
                        notes: ''
                      });
                      await bookingsAPI.updatePayment(res.data.data._id, { paymentStatus: 'paid', paymentMethod: 'online', paymentId: 'MOCK123' });
                      setBookingSuccess(true);
                    } catch (err) {
                      setBookingError('Booking failed. Please try again.');
                    } finally {
                      setBookingLoading(false);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">Date</label>
                      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Start Time</label>
                      <input type="time" value={bookingStart} onChange={e => setBookingStart(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">End Time</label>
                      <input type="time" value={bookingEnd} onChange={e => setBookingEnd(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={bookingLoading || bookingSuccess}>{bookingLoading ? 'Booking...' : bookingSuccess ? 'Booked!' : 'Book & Pay'}</button>
                    {bookingError && <div className="text-red-600 mt-2">{bookingError}</div>}
                    {bookingSuccess && <div className="text-green-600 mt-2">Booking successful! You can view it in your dashboard.</div>}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Right Column - Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              {activeSection !== 'booking' && (
                <div className="bg-glass/80 rounded-3xl shadow-glass p-8 border border-primary-100 backdrop-blur-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <span className="text-3xl font-extrabold text-primary-700">Rs. {artist.hourlyRate.toLocaleString()}</span>
                      <span className="text-dark/60 text-lg font-medium ml-2">/hour</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <FiStar className="mr-2 fill-current" size={20} />
                      <span className="font-bold text-lg">{artist.averageRating}</span>
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
          <h2 className="text-3xl font-bold mb-8 text-primary-700">Similar Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <WaveDivider />
    </div>
  );
};

export default ArtistDetailsPage;
