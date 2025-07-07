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
      className="rounded-3xl overflow-hidden group shadow-glass bg-glass border border-primary-100 hover:shadow-2xl transition-all duration-300 backdrop-blur-xs"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.025 }}
    >
      <div className="overflow-hidden relative">
        {/* Modern ribbon indicator */}
        <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-20">
          <div className="absolute top-0 left-0 w-24 h-24">
            <div className="absolute w-40 text-center transform -rotate-45 bg-gradient-to-r from-accent-400 to-primary-600 text-white font-bold text-xs py-1 -translate-y-[16px] -translate-x-[16px] shadow-lg tracking-wider">
              Featured
            </div>
          </div>
        </div>
        {/* Studio image with gradient overlay */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/70 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-glass border border-primary-100 z-10">
            <div className="flex items-center text-amber-500 font-bold text-lg">
              <FiStar className="mr-1 fill-current" />
              <span>{averageRating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiMapPin className="mr-2" />
                <span className="font-semibold text-lg drop-shadow">{location?.city || 'Location not specified'}</span>
              </div>
              <span className="font-bold text-xl drop-shadow">
                Rs. {pricePerHour?.toLocaleString() || '3,500'}/hr
              </span>
            </div>
          </div>
        </div>
        {/* Card body */}
        <div className="p-7 bg-glass/80 backdrop-blur-xs space-y-5 rounded-b-3xl border-t border-primary-50">
          <h3 className="text-2xl font-extrabold text-primary-700 group-hover:text-accent-600 transition-colors line-clamp-1 tracking-tight drop-shadow-sm">
            {name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(facilities.slice(0, 3) || ['Recording', 'Mixing']).map((facility, idx) => (
              <span 
                key={idx} 
                className="text-sm px-4 py-1 bg-primary-50/80 text-primary-700 rounded-full font-semibold shadow-inner"
              >
                {facility}
              </span>
            ))}
            {facilities?.length > 3 && (
              <span className="text-sm px-4 py-1 bg-gray-100/80 text-text-light rounded-full font-semibold shadow-inner">
                +{facilities.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-base text-dark/60 font-medium">
            <div className="flex items-center">
              <FiClock className="mr-2" /> Available now
            </div>
            <span className="font-bold text-accent-600">10 recent bookings</span>
          </div>
          <Link
            to={`/studios/${_id}`}
            className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-primary-700 to-accent-400 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 group-hover:-translate-y-1"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StudioCard;
