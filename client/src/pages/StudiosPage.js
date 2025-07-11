import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiClock, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { studiosAPI } from '../services/api';
import WaveDivider from '../components/ui/WaveDivider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const StudiosPage = () => {
  const [studios, setStudios] = useState([]);
  const [filteredStudios, setFilteredStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    priceRange: '',
    facilities: []
  });

  // Fetch studios data
  useEffect(() => {
    const fetchStudios = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filters.city) params.city = filters.city;
        if (filters.priceRange) params.priceRange = filters.priceRange;
        if (filters.facilities.length > 0) params.facilities = filters.facilities.join(',');
        const { data } = await studiosAPI.getAll(params);
        setStudios(data.data || []);
        setFilteredStudios(data.data || []);
      } catch (error) {
        console.error('Error fetching studios:', error);
        setStudios([]);
        setFilteredStudios([]);
      }
      setLoading(false);
    };
    fetchStudios();
  }, [searchTerm, filters]);

  // Handle search and filters
  useEffect(() => {
    let results = studios;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(studio => 
        studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply city filter
    if (filters.city) {
      results = results.filter(studio => studio.location.city === filters.city);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter(studio => 
        studio.pricePerHour >= min && (max ? studio.pricePerHour <= max : true)
      );
    }
    
    // Apply facilities filter
    if (filters.facilities.length) {
      results = results.filter(studio => 
        filters.facilities.every(facility => 
          (studio.facilities || []).map(f => f.name).includes(facility)
        )
      );
    }
    
    setFilteredStudios(results);
  }, [searchTerm, filters, studios]);

  // Handle facility toggle
  const toggleFacility = (facility) => {
    setFilters(prev => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility];
      
      return { ...prev, facilities };
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      city: '',
      priceRange: '',
      facilities: []
    });
    setSearchTerm('');
  };

  // Get unique cities for filter dropdown
  const cities = [...new Set(studios.map(studio => studio.location.city))];
  
  // Get all unique facilities for filter checkboxes
  const allFacilities = [...new Set(studios.flatMap(studio => (studio.facilities || []).map(f => f.name)).filter(Boolean))];

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent drop-shadow">Recording Studios</h1>
          <p className="text-xl text-dark/70 font-medium">Find and book the perfect recording studio across Sri Lanka</p>
        </div>
        {/* Search and Filter Bar */}
        <motion.div
          className="bg-glass/80 rounded-3xl shadow-glass p-6 mb-12 border border-primary-50 backdrop-blur-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <motion.div className="relative" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                  <FiSearch className="text-xl" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                  placeholder="Search studios by name or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </motion.div>
            </div>
            <motion.div className="flex gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <button 
                className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-xl font-bold text-lg shadow hover:scale-105 hover:shadow-2xl transition-all duration-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter className="mr-2" />
                Filters {filters.city || filters.priceRange || filters.facilities.length > 0 ? '(Active)' : ''}
              </button>
            </motion.div>
          </div>
          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      className="form-input"
                      value={filters.city}
                      onChange={e => setFilters({...filters, city: e.target.value})}
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (Rs/hour)</label>
                    <select
                      className="form-input"
                      value={filters.priceRange}
                      onChange={e => setFilters({...filters, priceRange: e.target.value})}
                    >
                      <option value="">Any Price</option>
                      <option value="0-2500">Under Rs. 2,500</option>
                      <option value="2500-3500">Rs. 2,500 - Rs. 3,500</option>
                      <option value="3500-5000">Rs. 3,500 - Rs. 5,000</option>
                      <option value="5000-">Over Rs. 5,000</option>
                    </select>
                  </div>
                  {/* Facilities Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                    <div className="flex flex-wrap gap-2">
                      {allFacilities.map(facility => (
                        <motion.button
                          key={facility}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.facilities.includes(facility)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleFacility(facility)}
                          whileHover={{ scale: 1.08 }}
                        >
                          {facility}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-2 border-t">
                  <button 
                    className="btn btn-outline text-sm flex items-center mr-2"
                    onClick={resetFilters}
                  >
                    <FiX className="mr-1" />
                    Reset
                  </button>
                  <button 
                    className="btn btn-primary text-sm"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading studios..." />
          </div>
        ) : filteredStudios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <FiSearch className="text-gray-400 text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-2">No Studios Found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button 
              className="btn btn-primary"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {filteredStudios.map((studio, idx) => (
              <motion.div 
                key={studio._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.04, y: -6, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={studio.images[0]?.url}
                    alt={studio.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center text-amber-500">
                      <FiStar className="mr-1 fill-current" />
                      <span className="font-medium">{studio.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{studio.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <FiMapPin className="mr-1 text-primary-500" /> 
                    <span>{studio.location.city}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{studio.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(studio.facilities.slice(0, 3) || []).map((facility, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {facility.name}
                      </span>
                    ))}
                    {studio.facilities.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        +{studio.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiClock className="mr-1" /> Available now
                    </div>
                    <div className="text-primary-600 font-bold">
                      Rs. {studio.pricePerHour}/hr
                    </div>
                  </div>
                  
                  <Link
                    to={`/studios/${studio._id}`}
                    className="block w-full text-center py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <WaveDivider />
    </div>
  );
};

export default StudiosPage;
