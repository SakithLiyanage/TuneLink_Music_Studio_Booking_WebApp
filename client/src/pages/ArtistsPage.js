import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown, FiStar, FiMusic } from 'react-icons/fi';

import ArtistCard from '../components/artists/ArtistCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Folk', 'R&B', 'World'];
  const instruments = ['Guitar', 'Piano', 'Drums', 'Bass', 'Vocals', 'Violin', 'Saxophone', 'Keyboard'];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // In a real app, this would be an API call
        // For now, using mock data
        const mockArtists = Array(12).fill().map((_, i) => ({
          _id: `artist${i + 1}`,
          user: { 
            name: `Artist ${i + 1}`, 
            avatar: i % 3 === 0 ? `https://randomuser.me/api/portraits/men/${i + 20}.jpg` : null
          },
          instruments: [
            instruments[i % instruments.length],
            instruments[(i + 3) % instruments.length]
          ],
          genres: [
            genres[i % genres.length],
            genres[(i + 2) % genres.length]
          ],
          hourlyRate: 2000 + (i * 100),
          averageRating: 4 + (i % 10) / 10,
          reviewCount: 5 + i
        }));
        
        setArtists(mockArtists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, []);
  
  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };
  
  const toggleInstrument = (instrument) => {
    setSelectedInstruments(prev => 
      prev.includes(instrument) 
        ? prev.filter(i => i !== instrument) 
        : [...prev, instrument]
    );
  };
  
  // Filter artists based on selected filters
  const filteredArtists = artists.filter(artist => {
    // Search term filter
    if (searchTerm && !artist.user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Genre filter
    if (selectedGenres.length > 0 && !artist.genres?.some(g => selectedGenres.includes(g))) {
      return false;
    }
    
    // Instrument filter
    if (selectedInstruments.length > 0 && !artist.instruments?.some(i => selectedInstruments.includes(i))) {
      return false;
    }
    
    // Rating filter
    if (ratingFilter > 0 && artist.averageRating < ratingFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-accent-400 bg-clip-text text-transparent drop-shadow">Artists</h1>
          <p className="text-xl text-dark/70 font-medium">Connect with talented musicians and producers across Sri Lanka</p>
        </div>
        {/* Search and Filter Bar */}
        <div className="bg-glass/80 rounded-3xl shadow-glass p-6 mb-12 border border-primary-50 backdrop-blur-xs">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                  <FiSearch className="text-xl" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-white/80 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-xs font-medium text-dark placeholder-gray-500"
                  placeholder="Search by artist name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-700 to-accent-400 text-white rounded-xl font-bold text-lg shadow hover:scale-105 hover:shadow-2xl transition-all duration-200"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FiFilter className="mr-2" />
                Filters
                <FiChevronDown className={`ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          {/* Expandable filters */}
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-primary-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Genre filter */}
                <div>
                  <h3 className="font-bold mb-3 text-lg text-primary-700">Genre</h3>
                  <div className="flex flex-wrap gap-3">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className={`px-4 py-2 rounded-full text-base font-semibold shadow-inner border border-primary-100 transition-all duration-200 ${
                          selectedGenres.includes(genre)
                            ? 'bg-primary-700 text-white shadow-glass' : 'bg-primary-50/80 text-primary-700 hover:bg-primary-100'
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Instrument filter */}
                <div>
                  <h3 className="font-bold mb-3 text-lg text-primary-700">Instrument</h3>
                  <div className="flex flex-wrap gap-3">
                    {instruments.map((instrument) => (
                      <button
                        key={instrument}
                        className={`px-4 py-2 rounded-full text-base font-semibold shadow-inner border border-accent-100 transition-all duration-200 ${
                          selectedInstruments.includes(instrument)
                            ? 'bg-accent-600 text-white shadow-glass' : 'bg-accent-50/80 text-accent-700 hover:bg-accent-100'
                        }`}
                        onClick={() => toggleInstrument(instrument)}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Rating filter */}
                <div>
                  <h3 className="font-bold mb-3 text-lg text-primary-700">Minimum Rating</h3>
                  <div className="flex items-center space-x-4">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        className={`flex items-center px-4 py-2 rounded-full text-base font-semibold shadow-inner border border-amber-200 transition-all duration-200 ${
                          ratingFilter === rating
                            ? 'bg-amber-500 text-white shadow-glass' : 'bg-amber-50/80 text-amber-700 hover:bg-amber-100'
                        }`}
                        onClick={() => setRatingFilter(rating)}
                      >
                        {rating > 0 && (
                          <FiStar className="mr-2" />
                        )}
                        {rating === 0 ? 'Any' : rating + '+'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        {/* Artists Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-20 text-2xl text-dark/60 font-semibold">
            No artists found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;
