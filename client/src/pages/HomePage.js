import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSearch, FiMusic, FiHeadphones, FiUsers, FiArrowRight, 
         FiStar, FiFilter } from 'react-icons/fi';

import HeroSection from '../components/ui/HeroSection';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AdvancedAnimatedText from '../components/ui/AdvancedAnimatedText';
import StudioCard from '../components/studios/StudioCard';
import ArtistCard from '../components/artists/ArtistCard';
import TestimonialSlider from '../components/ui/TestimonialSlider';
import WaveDivider from '../components/ui/WaveDivider';

// Define useScrollAnimation with properly imported useAnimation
const useScrollAnimation = (threshold = 0.1) => {
  const [ref, inView] = useInView({ 
    threshold, 
    triggerOnce: true,
    rootMargin: '-50px 0px'
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  return { ref, controls, inView };
};

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const HomePage = () => {
  const [featuredStudios, setFeaturedStudios] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [genres] = useState([
    'Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Folk', 'R&B'
  ]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  
  const studioSection = useScrollAnimation(0.2);
  const genreSection = useScrollAnimation(0.2);
  
  // Fetch featured data (studios and artists)
  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setFeaturedStudios([
          {
            _id: '1',
            name: 'Celestial Sound Studios',
            location: { city: 'Colombo' },
            pricePerHour: 3500,
            images: [{ url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500' }],
            averageRating: 4.7
          },
          {
            _id: '2',
            name: 'Rhythm Nation',
            location: { city: 'Kandy' },
            pricePerHour: 2800,
            images: [{ url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=500' }],
            averageRating: 4.5
          },
          {
            _id: '3',
            name: 'Ocean Wave Productions',
            location: { city: 'Galle' },
            pricePerHour: 3200,
            images: [{ url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=500' }],
            averageRating: 4.8
          }
        ]);

        setFeaturedArtists([
          {
            _id: '1',
            user: { name: 'Amal Perera' },
            instruments: ['Guitar', 'Vocals'],
            hourlyRate: 2500,
            averageRating: 4.9
          },
          {
            _id: '2',
            user: { name: 'Lakshika Silva' },
            instruments: ['Flute', 'Keyboard'],
            hourlyRate: 2200,
            averageRating: 4.6
          },
          {
            _id: '3',
            user: { name: 'Raj Dharmasena' },
            instruments: ['Drums', 'Percussion'],
            hourlyRate: 2800,
            averageRating: 4.7
          }
        ]);

        // Add testimonials mock data
        setTestimonials([
          {
            name: 'Amal Fernando',
            role: 'Recording Artist',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 5,
            text: 'TuneLink transformed my music career. I found the perfect studio for my album and connected with amazing session musicians.'
          },
          {
            name: 'Lakshika Silva',
            role: 'Studio Owner',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            text: 'As a studio owner, TuneLink has dramatically increased our bookings. The platform brings us qualified clients and makes scheduling seamless.'
          },
          {
            name: 'Raj Dharmasena',
            role: 'Music Producer',
            avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
            rating: 4,
            text: 'I\'ve discovered incredible talent through TuneLink. The quality of artists on this platform is outstanding.'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured data:', error);
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section with Animated Counters */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-primary-600 text-white rounded-lg p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-3xl font-bold">
                <AnimatedCounter end={500} duration={2} />
              </div>
              <div className="text-sm mt-2">
                Artists Registered
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-primary-600 text-white rounded-lg p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="text-3xl font-bold">
                <AnimatedCounter end={150} duration={2} />
              </div>
              <div className="text-sm mt-2">
                Studios Available
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-primary-600 text-white rounded-lg p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="text-3xl font-bold">
                <AnimatedCounter end={1200} duration={2} />
              </div>
              <div className="text-sm mt-2">
                Successful Bookings
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Studios Section with Modern Cards */}
      <section className="py-20 bg-card relative">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary-100 rounded-full opacity-50 blur-xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={studioSection.ref}
            initial="hidden"
            animate={studioSection.controls}
            variants={containerVariants}
            className="mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-main"
              variants={itemVariants}
            >
              <AdvancedAnimatedText text="Featured Studios" className="block" />
            </motion.h2>
            <motion.p 
              className="text-text-light text-center max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Discover top-rated recording spaces across Sri Lanka, fully equipped for your next project
            </motion.p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredStudios.length > 0 ? featuredStudios : [1, 2, 3]).map((studio, index) => (
                <StudioCard key={studio._id || index} studio={studio} />
              ))}
            </div>
          )}
          
          <motion.div 
            className="text-center mt-10"
            variants={containerVariants}
            initial="hidden"
            animate={studioSection.controls}
          >
            <Link to="/studios" className="btn btn-primary inline-flex items-center">
              Explore All Studios <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-main"
              variants={itemVariants}
            >
              <AdvancedAnimatedText text="What People Say" className="block" />
            </motion.h2>
            <motion.p 
              className="text-text-light text-center max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Hear from our community of artists, studios, and music lovers
            </motion.p>
          </motion.div>
          
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Genre Browse Section with Interactive Cards */}
      <section className="py-20 bg-white relative">
        <WaveDivider color="#f9fafb" height={80} position="top" />
        <div className="container mx-auto px-4 mt-12">
          <motion.div
            ref={genreSection.ref}
            initial="hidden"
            animate={genreSection.controls}
            variants={containerVariants}
            className="mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-3"
              variants={itemVariants}
            >
              <AdvancedAnimatedText text="Explore by Genre" className="block" />
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-center max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Discover artists and studios specialized in your favorite musical styles
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate={genreSection.controls}
          >
            <motion.button
              className={`px-6 py-2 rounded-full transition-colors ${
                activeGenre === 'All' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveGenre('All')}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {genres.map((genre, index) => (
              <motion.button
                key={genre}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeGenre === genre ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveGenre(genre)}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {genre}
              </motion.button>
            ))}
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={genreSection.controls}
          >
            {genres.slice(0, 4).map((genre, index) => (
              <motion.div
                key={genre}
                className="relative overflow-hidden rounded-xl group cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src={`https://source.unsplash.com/random/600x800?music,${genre.toLowerCase()}`} 
                  alt={`Genre ${genre}`}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                  <div className="p-5 w-full">
                    <h3 className="text-xl font-bold text-white mb-1">{genre}</h3>
                    <p className="text-sm text-white/80">{(index + 5) * 3} Artists</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-10"
            variants={itemVariants}
            initial="hidden"
            animate={genreSection.controls}
          >
            <Link to="/genres" className="btn btn-outline inline-flex items-center">
              View All Genres <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-3"
              variants={itemVariants}
            >
              <AdvancedAnimatedText text="Top Artists" className="block" />
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-center max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Connect with Sri Lanka's most talented musicians for your next project
            </motion.p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {featuredArtists.map((artist, index) => (
                <motion.div 
                  key={artist._id} 
                  className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-md"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {artist.user.name.charAt(0)}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{artist.user.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {artist.instruments.map((instrument, i) => (
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
                        <span className="font-medium">{artist.averageRating.toFixed(1)}</span>
                      </div>
                      <span className="text-primary-600 font-bold">
                        Rs. {artist.hourlyRate}/hr
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/artists/${artist._id}`}
                    className="block w-full text-center py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg transition transform hover:-translate-y-1 hover:shadow-md"
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/artists" className="btn btn-outline inline-flex items-center">
              Explore All Artists <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Modern Design */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700 opacity-95"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 skew-x-12"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-white opacity-5 -skew-x-12"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full transform translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              variants={itemVariants}
            >
              <AdvancedAnimatedText text="Ready to Join TuneLink?" className="block" />
            </motion.h2>
            <motion.p 
              className="text-lg mb-10 text-white/90 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Whether you're a studio owner, musician, or looking to record your next hit, 
              TuneLink makes it easy to connect and create amazing music.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link to="/register?role=client" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8">
                  Join as Client
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/register?role=artist" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8">
                  Join as Artist
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/register?role=studio" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8">
                  List Your Studio
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
