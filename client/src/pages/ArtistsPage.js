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
    <div className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Artists</h1>
          <p className="text-gray-600">Connect with talented musicians and producers across Sri Lanka</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search by artist name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FiFilter className="mr-2" />
                Filters
                <FiChevronDown className={`ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Additional filter buttons could go here */}
            </div>
          </div>
          
          {/* Expandable filters */}
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Genre filter */}
                <div>
                  <h3 className="font-medium mb-2">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedGenres.includes(genre)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Instrument filter */}
                <div>
                  <h3 className="font-medium mb-2">Instrument</h3>
                  <div className="flex flex-wrap gap-2">
                    {instruments.map((instrument) => (
                      <button
                        key={instrument}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedInstruments.includes(instrument)
                            ? 'bg-secondary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                        onClick={() => toggleInstrument(instrument)}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Rating filter */}
                <div>
                  <h3 className="font-medium mb-2">Minimum Rating</h3>
                  <div className="flex items-center space-x-4">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          ratingFilter === rating
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                        onClick={() => setRatingFilter(rating)}
                      >
                        {rating > 0 && (
                          <>
                            <FiStar className="mr-1 fill-current" />
                            {rating}+
                          </>
                        )}
                        {rating === 0 && 'Any rating'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => {
                    setSelectedGenres([]);
                    setSelectedInstruments([]);
                    setRatingFilter(0);
                    setSearchTerm('');
                  }}
                >
                  Reset filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Artists Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {filteredArtists.length === 0 ? (
              <div className="text-center py-12">
                <FiMusic className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No artists found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist, index) => (
                  <ArtistCard key={artist._id} artist={artist} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;
