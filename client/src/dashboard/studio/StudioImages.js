import React from 'react';
import { motion } from 'framer-motion';
import { FiCamera } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const StudioImages = () => {
  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-10 md:p-14 border border-primary-100 backdrop-blur-xs"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center mb-8 gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-accent-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              <FiCamera />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1">Studio Images</h1>
              <p className="text-dark/60 text-lg">Manage your studio images here</p>
            </div>
          </div>
          <div className="text-center text-dark/60 text-lg py-16">
            Image management features coming soon!
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioImages;
