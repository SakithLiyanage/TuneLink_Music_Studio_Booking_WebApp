import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiMusic, FiUser } from 'react-icons/fi';

const TestimonialSlider = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  
  // Auto-advance slides
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  // Navigate to previous slide
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-4xl mx-auto relative px-10">
        <div className="absolute inset-x-0 top-1/4 h-32 bg-primary-50 rounded-3xl -z-10 transform -skew-y-3"></div>
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5
            }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-10 min-h-[320px] flex flex-col justify-center items-center text-center"
          >
            {testimonials[currentIndex] && (
              <>
                <div className="mb-6 relative">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 shadow-md"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-1 shadow-sm">
                    <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      {testimonials[currentIndex].role.includes('Artist') ? 
                        <FiMusic size={16} /> : <FiUser size={16} />
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-amber-500 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`${i < testimonials[currentIndex].rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl italic text-text-main mb-6 px-4 font-light">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div className="flex flex-col items-center">
                  <h4 className="font-bold text-lg text-primary-600">{testimonials[currentIndex].name}</h4>
                  <p className="text-text-light">{testimonials[currentIndex].role}</p>
                </div>
                
                {/* Decorative quotes */}
                <div className="absolute top-8 left-8 text-primary-100 text-6xl font-serif">❝</div>
                <div className="absolute bottom-8 right-8 text-primary-100 text-6xl font-serif">❞</div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <button
          onClick={() => {
            setDirection(-1);
            setCurrentIndex((prevIndex) => 
              prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
            );
          }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors z-10"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={() => {
            setDirection(1);
            setCurrentIndex((prevIndex) => 
              prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
          }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors z-10"
          aria-label="Next testimonial"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-primary-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
