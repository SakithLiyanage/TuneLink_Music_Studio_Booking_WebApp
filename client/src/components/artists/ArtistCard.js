import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMusic } from 'react-icons/fi';

const ArtistCard = ({ artist }) => {
  if (!artist) return null;

  const {
    _id,
    user,
    instruments = [],
    hourlyRate,
    averageRating
  } = artist;

  return (
    <motion.div 
      className="bg-glass/80 rounded-3xl shadow-glass p-7 hover:shadow-2xl transition-all duration-300 backdrop-blur-xs border border-primary-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Artist image and info */}
      <div className="flex items-center mb-8">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.08 }}
        >
          <motion.div 
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-700 via-primary-500 to-accent-400 text-white flex items-center justify-center text-3xl font-bold mr-6 shadow-glass overflow-hidden border-2 border-white/50"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || 'A'
            )}
          </motion.div>
          
          {/* Badge indicator */}
          <div className="absolute -right-3 -bottom-3 bg-gradient-to-r from-accent-400 to-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-glass border-2 border-white">
            <FiMusic size={18} />
          </div>
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-extrabold mb-2 text-primary-700 tracking-tight">{user?.name || 'Artist Name'}</h3>
          <div className="flex flex-wrap gap-2">
            {instruments.map((instrument, i) => (
              <span key={i} className="text-sm px-3 py-1 bg-primary-50/80 text-primary-700 rounded-full border border-primary-100 font-semibold shadow-inner">
                {instrument}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Rating and price */}
      <div className="bg-white/80 p-5 rounded-2xl mb-6 shadow-glass border border-primary-50 backdrop-blur-xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-amber-500">
            <FiStar className="fill-current mr-2 text-xl" />
            <span className="font-bold text-xl text-dark">{averageRating?.toFixed(1) || '4.7'}</span>
            <span className="text-dark/60 ml-2 font-medium">({artist.ratingCount || '12'} reviews)</span>
          </div>
          <span className="text-primary-700 font-bold text-xl">
            Rs. {hourlyRate?.toLocaleString() || '2,500'}/hr
          </span>
        </div>
      </div>
      
      {/* Skills badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['Vocals', 'Composition', 'Production'].map((skill, i) => (
          <span key={i} className="text-sm px-3 py-1 bg-accent-50/80 text-accent-700 rounded-full font-semibold shadow-inner border border-accent-100">
            {skill}
          </span>
        ))}
      </div>
      
      <Link
        to={`/artists/${_id || '1'}`}
        className="block w-full text-center py-4 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

export default ArtistCard;
