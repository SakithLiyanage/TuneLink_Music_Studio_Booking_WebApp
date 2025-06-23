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
      className="bg-card rounded-2xl shadow-soft p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Artist image and info */}
      <div className="flex items-center mb-6">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-2xl font-bold mr-4 shadow-md overflow-hidden"
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
          <div className="absolute -right-2 -bottom-2 bg-secondary-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            <FiMusic size={14} />
          </div>
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 text-text-main">{user?.name || 'Artist Name'}</h3>
          <div className="flex flex-wrap gap-2">
            {instruments.map((instrument, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-100">
                {instrument}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Rating and price */}
      <div className="bg-white p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-amber-500">
            <FiStar className="fill-current mr-1" />
            <span className="font-medium text-text-main">{averageRating?.toFixed(1) || '4.7'}</span>
            <span className="text-text-light ml-1">({artist.ratingCount || '12'} reviews)</span>
          </div>
          <span className="text-primary-600 font-bold">
            Rs. {hourlyRate?.toLocaleString() || '2,500'}/hr
          </span>
        </div>
      </div>
      
      {/* Skills badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Vocals', 'Composition', 'Production'].map((skill, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-accent-50 text-accent-700 rounded-full">
            {skill}
          </span>
        ))}
      </div>
      
      <Link
        to={`/artists/${_id || '1'}`}
        className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg transition transform hover:-translate-y-1 hover:shadow-md"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

export default ArtistCard;
