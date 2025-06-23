import React from 'react';
import { motion } from 'framer-motion';

const AdvancedAnimatedText = ({ 
  text, 
  className, 
  once = true, 
  type = 'chars', 
  staggerChildren = 0.02, 
  delayChildren = 0,
  duration = 0.5,
  delay = 0
}) => {
  const options = {
    words: {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { 
          staggerChildren, 
          delayChildren: delayChildren * i,
          delay
        },
      }),
    },
    chars: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay
        }
      }
    }
  };
  
  // Split text into words or characters
  const getTextElements = () => {
    if (type === 'words') {
      return text.split(' ').map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={options.chars}
        >
          {word}{' '}
        </motion.span>
      ));
    } else { // chars
      return text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={options.chars}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={options.words}
    >
      {getTextElements()}
    </motion.span>
  );
};

export default AdvancedAnimatedText;
