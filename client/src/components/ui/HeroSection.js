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
    <section className="pt-32 md:pt-40 pb-20 md:pb-32 relative bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-[80vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="bg-glass shadow-glass inline-flex items-center py-2 px-6 rounded-full text-primary-700 border border-primary-100 backdrop-blur-xs font-semibold text-base"
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-dark drop-shadow-xl">
              Connect with <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 animate-gradient-x"
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
            <p className="text-xl md:text-2xl text-dark/70 leading-relaxed font-medium">
              Book recording studios, session musicians, and producers to bring your musical vision to life across Sri Lanka.
            </p>
            <motion.div 
              className="bg-white/80 rounded-3xl shadow-glass p-7 border border-primary-100 relative backdrop-blur-xs"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <motion.button 
                    onClick={togglePlayback}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-primary-200 text-white mr-5 text-2xl font-bold transition-all duration-200 hover:scale-110 hover:shadow-2xl ${
                      isPlaying ? 'bg-accent-500' : 'bg-primary-700'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? <FiPause size={28} /> : <FiPlay className="ml-1" size={28} />}
                  </motion.button>
                  <div>
                    <div className="font-semibold text-primary-700 text-lg">Listen to Local Talent</div>
                    <div className="text-sm text-dark/60">Sample track from TuneLink artists</div>
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
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-100 rounded-full blur-sm -z-10"></div>
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent-100 rounded-full blur-sm -z-10"></div>
            </motion.div>
            <motion.div 
              className="pt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/studios" className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-700 to-accent-400 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center group">
                Find Studios
                <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/artists" className="px-8 py-3 rounded-xl bg-white/90 text-primary-700 font-bold text-lg shadow-lg border border-primary-200 hover:bg-primary-50 hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center group">
                Find Artists
                <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
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
                  className="rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/80"
                  style={{ perspective: "1000px" }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {/* Floating elements around the image */}
                <motion.div 
                  className="absolute -top-8 -left-6"
                  animate={floatingAnimation}
                  style={{ transformStyle: 'preserve-3d', translateZ: '40px' }}
                >
                  <div className="flex items-center bg-white/90 p-3 rounded-xl shadow-glass border border-primary-100">
                    <FiMusic className="text-accent-500 mr-2" size={22} />
                    <span className="text-sm font-semibold">Pro Studio</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute top-1/3 -right-10"
                  animate={{ ...floatingAnimation, transition: { delay: 0.5, ...floatingAnimation.transition } }}
                  style={{ transformStyle: 'preserve-3d', translateZ: '60px' }}
                >
                  <div className="bg-glass p-4 rounded-xl shadow-glass border border-primary-100">
                    <div className="flex items-center text-primary-700 font-bold text-lg">
                      <FiUsers className="mr-2" />
                      <span>5,000+</span>
                    </div>
                    <div className="text-xs text-dark/60">Musicians</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-14 -left-14"
                  animate={{ ...floatingAnimation, transition: { delay: 1, ...floatingAnimation.transition } }}
                  style={{ transformStyle: 'preserve-3d', translateZ: '80px' }}
                >
                  <div className="bg-white/90 p-3 rounded-full shadow-glass border border-accent-100 h-20 w-20 flex items-center justify-center">
                    <FiHeadphones className="text-secondary-500" size={32} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
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
