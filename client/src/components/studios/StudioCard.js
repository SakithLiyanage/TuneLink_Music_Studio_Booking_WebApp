import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';

const StudioCard = ({ studio }) => {
  if (!studio) return null;

  const {
    _id,
    name,
    location,
    pricePerHour,
    images,
    averageRating,
    facilities = []
  } = studio;

  return (
    <motion.div 
      className="rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
    >
      <div className="overflow-hidden relative">
        {/* Modern ribbon indicator */}
        <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24">
            <div className="absolute w-40 text-center transform -rotate-45 bg-secondary-500 text-white font-semibold text-xs py-1 -translate-y-[16px] -translate-x-[16px] shadow-sm">
              Featured
            </div>
          </div>
        </div>

        {/* Studio image with gradient overlay */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <div className="flex items-center text-amber-500">
              <FiStar className="mr-1 fill-current" />
              <span className="font-medium">{averageRating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>{location?.city || 'Location not specified'}</span>
              </div>
              <span className="font-medium">
                Rs. {pricePerHour?.toLocaleString() || '3,500'}/hr
              </span>
            </div>
          </div>
        </div>
        
        {/* Card body */}
        <div className="p-6 bg-card space-y-4">
          <h3 className="text-xl font-bold text-text-main group-hover:text-primary-600 transition-colors line-clamp-1">{name}</h3>
          
          <div className="flex flex-wrap gap-2">
            {(facilities.slice(0, 3) || ['Recording', 'Mixing']).map((facility, idx) => (
              <span 
                key={idx} 
                className="text-sm px-3 py-1 bg-primary-50 text-primary-600 rounded-full"
              >
                {facility}
              </span>
            ))}
            {facilities?.length > 3 && (
              <span className="text-sm px-3 py-1 bg-gray-100 text-text-light rounded-full">
                +{facilities.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-text-light">
            <div className="flex items-center">
              <FiClock className="mr-1" /> Available now
            </div>
            <span className="font-medium text-accent-600">10 recent bookings</span>
          </div>
          
          <Link
            to={`/studios/${_id}`}
            className="block w-full text-center py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg shadow-sm hover:shadow-md transition transform group-hover:-translate-y-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioCard;
