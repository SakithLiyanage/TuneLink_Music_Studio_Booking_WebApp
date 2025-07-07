import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-100 to-light flex items-center justify-center pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center bg-glass/80 rounded-3xl shadow-glass p-16 border border-primary-100 backdrop-blur-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            404
          </motion.h1>
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Page Not Found
          </motion.h2>
          <motion.p 
            className="text-xl text-dark/70 font-medium mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The page you are looking for doesn't exist or has been moved. Let's get you back on track to discover amazing music.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              to="/" 
              className="px-8 py-4 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center group"
            >
              <FiHome className="mr-3 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
            <Link 
              to="/studios" 
              className="px-8 py-4 bg-white/90 text-primary-700 rounded-xl font-bold text-lg shadow-lg border border-primary-200 hover:bg-primary-50 hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center group"
            >
              <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" />
              Browse Studios
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
