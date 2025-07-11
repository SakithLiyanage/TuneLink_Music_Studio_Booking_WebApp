import React from 'react';
import { FiMusic } from 'react-icons/fi';
import { motion } from 'framer-motion';

const notes = [
  { delay: 0, color: 'text-primary-600' },
  { delay: 0.2, color: 'text-accent-400' },
  { delay: 0.4, color: 'text-secondary-500' },
];

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="flex space-x-2 mb-4">
      {notes.map((note, idx) => (
        <motion.div
          key={idx}
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: [0, -18, 0], opacity: [0.7, 1, 0.7] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            delay: note.delay,
            ease: "easeInOut"
          }}
        >
          <FiMusic className={`w-8 h-8 ${note.color} drop-shadow`} />
        </motion.div>
      ))}
    </div>
    <div className="text-primary-600 font-medium animate-pulse">{text}</div>
  </div>
);

export default LoadingSpinner;
