import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { FiPlay, FiPause, FiArrowRight, FiMusic, FiHeadphones, FiUsers } from 'react-icons/fi';
import AudioWave from './AudioWave';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Floating animation for elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 relative bg-gradient-to-br from-primary-50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="bg-white shadow-soft inline-flex items-center py-2 px-4 rounded-full text-primary-600 border border-primary-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="flex h-3 w-3 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
              </span>
              Sri Lanka's Premier Music Platform
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Connect with <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                Musical Talent
              </motion.span> and Studios
            </h1>
            
            <p className="text-lg md:text-xl text-text-light leading-relaxed">
              Book recording studios, session musicians, and producers to bring your musical vision to life across Sri Lanka.
            </p>
            
            <motion.div 
              className="bg-card rounded-2xl shadow-xl p-5 border border-primary-100 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <motion.button 
                    onClick={togglePlayback}
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      isPlaying ? 'bg-error-500' : 'bg-primary-600'
                    } text-white mr-4 hover:scale-105 transition-all`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ boxShadow: "0 0 15px rgba(75, 0, 130, 0.5)" }}
                  >
                    {isPlaying ? <FiPause size={24} /> : <FiPlay className="ml-1" size={24} />}
                  </motion.button>
                  <div>
                    <div className="font-medium text-primary-700">Listen to Local Talent</div>
                    <div className="text-sm text-text-light">Sample track from TuneLink artists</div>
                  </div>
                </div>
              </div>
              
              <AudioWave />
              
              <audio 
                ref={audioRef} 
                src="https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg"
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Decorative elements */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-primary-100 rounded-full -z-10"></div>
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-secondary-100 rounded-full -z-10"></div>
            </motion.div>

            <motion.div 
              className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/studios" className="btn btn-primary btn-with-icon group">
                Find Studios
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/artists" className="btn btn-secondary btn-with-icon group">
                Find Artists
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* 3D-style Interactive Image Block */}
          <div className="relative">
            <motion.div
              className="perspective-1000"
              onMouseMove={handleMouseMove}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d'
                }}
                className="relative z-10"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=600"
                  alt="Studio Recording"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover transform"
                  style={{ perspective: "1000px" }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                
                {/* Floating elements around the image */}
                <motion.div 
                  className="absolute -top-6 -left-4"
                  animate={floatingAnimation}
                  style={{ transformStyle: 'preserve-3d', translateZ: '40px' }}
                >
                  <div className="flex items-center bg-white p-2 rounded-lg shadow-lg">
                    <FiMusic className="text-accent-500 mr-1" size={18} />
                    <span className="text-xs font-medium">Pro Studio</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-1/3 -right-8"
                  animate={{ ...floatingAnimation, transition: { delay: 0.5, ...floatingAnimation.transition } }}
                  style={{ transformStyle: 'preserve-3d', translateZ: '60px' }}
                >
                  <div className="bg-card p-3 rounded-lg shadow-lg">
                    <div className="flex items-center text-primary-600">
                      <FiUsers className="mr-1" />
                      <span className="font-medium">5,000+</span>
                    </div>
                    <div className="text-xs text-text-light">Musicians</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-10 -left-10"
                  animate={{ ...floatingAnimation, transition: { delay: 1, ...floatingAnimation.transition } }}
                  style={{ transformStyle: 'preserve-3d', translateZ: '80px' }}
                >
                  <div className="bg-white p-2 rounded-full shadow-lg h-16 w-16 flex items-center justify-center">
                    <FiHeadphones className="text-secondary-500" size={28} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full -z-10 opacity-60 blur-md"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-100 rounded-full -z-10 opacity-60 blur-md"></div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
