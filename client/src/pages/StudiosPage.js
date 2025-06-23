import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiClock, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
      try {
        // In a real app, we would fetch from API
        // For now, using dummy data
        const dummyStudios = [
          {
            _id: '1',
            name: 'Celestial Sound Studios',
            description: 'Professional recording studio with state-of-the-art equipment.',
            location: { city: 'Colombo', address: '123 Galle Road' },
            pricePerHour: 3500,
            images: [{ url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500' }],
            averageRating: 4.7,
            facilities: ['Recording Booth', 'Mixing Console', 'Instruments'],
            amenities: ['Air Conditioning', 'Lounge', 'Parking']
          },
          {
            _id: '2',
            name: 'Rhythm Nation',
            description: 'Cozy recording space perfect for solo artists and small bands.',
            location: { city: 'Kandy', address: '45 Hill Street' },
            pricePerHour: 2800,
            images: [{ url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=500' }],
            averageRating: 4.5,
            facilities: ['Recording Booth', 'Mixing Console'],
            amenities: ['Air Conditioning', 'WiFi']
          },
          {
            _id: '3',
            name: 'Ocean Wave Productions',
            description: 'Beachside studio with unique acoustic characteristics.',
            location: { city: 'Galle', address: '78 Beach Road' },
            pricePerHour: 3200,
            images: [{ url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=500' }],
            averageRating: 4.8,
            facilities: ['Recording Booth', 'Mixing Console', 'Instruments', 'Live Room'],
            amenities: ['Air Conditioning', 'Lounge', 'Beachfront View']
          },
          {
            _id: '4',
            name: 'Urban Beats Studio',
            description: 'Modern studio specializing in urban and electronic music.',
            location: { city: 'Colombo', address: '15 Park Avenue' },
            pricePerHour: 3800,
            images: [{ url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=500' }],
            averageRating: 4.6,
            facilities: ['Recording Booth', 'Mixing Console', 'Beat Production'],
            amenities: ['Air Conditioning', 'Lounge', 'Parking']
          },
          {
            _id: '5',
            name: 'Heritage Records',
            description: 'Traditional studio focusing on acoustic and cultural music.',
            location: { city: 'Kandy', address: '22 Temple Road' },
            pricePerHour: 2500,
            images: [{ url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500' }],
            averageRating: 4.9,
            facilities: ['Recording Booth', 'Traditional Instruments'],
            amenities: ['Garden', 'Tea Service']
          },
          {
            _id: '6',
            name: 'Coastal Tunes',
            description: 'Relaxed studio environment with ocean views.',
            location: { city: 'Negombo', address: '56 Beach Road' },
            pricePerHour: 3000,
            images: [{ url: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=500' }],
            averageRating: 4.4,
            facilities: ['Recording Booth', 'Mixing Console', 'Outdoor Recording'],
            amenities: ['Beachfront', 'Accommodation']
          }
        ];
        
        setStudios(dummyStudios);
        setFilteredStudios(dummyStudios);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching studios:', error);
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

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
          studio.facilities.includes(facility)
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
  const allFacilities = [...new Set(studios.flatMap(studio => studio.facilities))];

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Recording Studios</h1>
          <p className="text-gray-600">Find and book the perfect recording studio across Sri Lanka</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                className="form-input pl-10 w-full"
                placeholder="Search studios by name or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-outline flex items-center justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-2" />
              Filters {filters.city || filters.priceRange || filters.facilities.length > 0 ? '(Active)' : ''}
            </button>
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
                        <button
                          key={facility}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.facilities.includes(facility)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleFacility(facility)}
                        >
                          {facility}
                        </button>
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
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredStudios.map(studio => (
              <motion.div 
                key={studio._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                    {studio.facilities.slice(0, 3).map((facility, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {facility}
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
    </div>
  );
};

export default StudiosPage;
