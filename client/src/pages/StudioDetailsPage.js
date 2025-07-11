import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMapPin, FiStar, FiDollarSign, FiClock, FiMusic, 
  FiWifi, FiTruck, FiThumbsUp, FiCalendar, FiArrowLeft,
  FiGrid, FiCamera, FiUser, FiHeart, FiShare2, FiInfo,
  FiCoffee, FiCheckCircle, FiBarChart2, FiMessageCircle
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { studiosAPI } from '../services/api';
import { bookingsAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const StudioDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [totalHours, setTotalHours] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Add a function to refresh studio details
  const refreshStudio = async () => {
    setLoading(true);
    try {
      const { data } = await studiosAPI.getById(id);
      setStudio(data.data);
    } catch (error) {
      setStudio(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchStudioData = async () => {
      setLoading(true);
      try {
        const { data } = await studiosAPI.getById(id);
        setStudio(data.data);
      } catch (error) {
        console.error('Error fetching studio details:', error);
        setStudio(null);
      }
      setLoading(false);
    };
    fetchStudioData();
  }, [id]);

  const handleBooking = () => {
    // In a real app, this would call the booking API
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 5000);
  };
  
  const generateTimeSlots = () => {
    // Generate time slots from 9 AM to 10 PM
    const slots = [];
    for (let hour = 9; hour < 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const isBooked = Math.random() > 0.7; // Random booking status for demo
      slots.push({ time, isBooked });
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  if (loading) {
    return (
      <LoadingSpinner text="Loading studio details..." />
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center">
        <FiInfo className="text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Studio Not Found</h2>
        <p className="text-gray-600 mb-6">The studio you're looking for doesn't exist or has been removed.</p>
        <Link to="/studios" className="btn btn-primary">
          <FiArrowLeft className="mr-2" /> Back to Studios
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-primary-50 via-accent-100 to-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/studios" 
          className="inline-flex items-center text-primary-700 font-bold mb-8 group text-lg hover:underline hover:text-accent-600 transition-all"
        >
          <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform text-xl" /> 
          Back to Studios
        </Link>
        {/* Studio Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="space-y-4">
            <motion.div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-glass border border-primary-100 bg-glass/80 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={studio.images[selectedImage].url} 
                alt={studio.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent rounded-b-3xl">
                <p className="text-white font-medium text-lg">{studio.images[selectedImage].caption}</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-4 gap-3">
              {studio.images.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-[4/3] overflow-hidden rounded-lg cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image.url} 
                    alt={`Studio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{studio.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <FiMapPin className="mr-1" /> 
                  {studio.location.address}, {studio.location.city}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <FiHeart className="text-gray-600" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <FiShare2 className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
              <div className="flex items-center text-amber-500">
                <FiStar className="mr-1 fill-current" />
                <span className="font-bold">{studio.averageRating}</span>
                <span className="text-gray-600 ml-1">({studio.ratingCount} reviews)</span>
              </div>
              <div className="text-primary-600 font-bold flex items-center">
                <FiDollarSign className="mr-1" />
                Rs. {studio.pricePerHour}/hour
              </div>
            </div>
            
            {/* Booking Calendar */}
            <h2 className="text-xl font-semibold mb-4">Book Your Session</h2>
            
            {bookingSuccess ? (
              <motion.div 
                className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <FiCheckCircle className="mr-2 text-xl" />
                <div>
                  <p className="font-medium">Booking Request Sent!</p>
                  <p className="text-sm">The studio owner will confirm your booking soon.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setBookingLoading(true);
                setBookingError('');
                try {
                  const res = await bookingsAPI.create({
                    studioId: studio._id,
                    date: bookingDate,
                    startTime: bookingStart,
                    endTime: bookingEnd,
                    duration: (parseInt(bookingEnd) - parseInt(bookingStart)) || 1,
                    totalCost: studio.pricePerHour,
                    services: [],
                    notes: ''
                  });
                  await bookingsAPI.updatePayment(res.data.data._id, { paymentStatus: 'paid', paymentMethod: 'online', paymentId: 'MOCK123' });
                  setBookingSuccess(true);
                } catch (err) {
                  setBookingError('Booking failed. Please try again.');
                } finally {
                  setBookingLoading(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Start Time</label>
                  <input type="time" value={bookingStart} onChange={e => setBookingStart(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Time</label>
                  <input type="time" value={bookingEnd} onChange={e => setBookingEnd(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={bookingLoading || bookingSuccess}>{bookingLoading ? 'Booking...' : bookingSuccess ? 'Booked!' : 'Book & Pay'}</button>
                {bookingError && <div className="text-red-600 mt-2">{bookingError}</div>}
                {bookingSuccess && <div className="text-green-600 mt-2">Booking successful! You can view it in your dashboard.</div>}
              </form>
            )}
            
            <div className="mt-4 text-center text-gray-500 text-sm">
              You won't be charged yet
            </div>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="border-b mb-8">
          <div className="flex overflow-x-auto space-x-8">
            {['overview', 'facilities', 'reviews', 'location'].map((section) => (
              <button
                key={section}
                className={`py-4 px-2 font-medium transition-colors ${
                  activeSection === section 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeSection === 'overview' && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About This Studio</h2>
                  <p className="text-gray-600 leading-relaxed">{studio.description}</p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Studio Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: <FiMusic />, text: "Professional recording environment" },
                      { icon: <FiBarChart2 />, text: "Excellent acoustics" },
                      { icon: <FiCoffee />, text: "Complimentary refreshments" },
                      { icon: <FiWifi />, text: "High-speed WiFi" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Equipment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {studio.equipment.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <FiCheckCircle className="text-primary-600 mr-2" />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About the Host</h2>
                  <div className="flex items-start">
                    {studio.owner ? (
                      <>
                        <img 
                          src={studio.owner.avatar} 
                          alt={studio.owner.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{studio.owner.name}</h3>
                          <p className="text-gray-600">Studio Owner</p>
                          <div className="flex items-center mt-2 space-x-4 text-sm">
                            <span className="flex items-center">
                              <FiThumbsUp className="mr-1 text-primary-600" />
                              {studio.owner.responseRate ? `${studio.owner.responseRate} response rate` : 'No response rate'}
                            </span>
                            <span className="flex items-center">
                              <FiClock className="mr-1 text-primary-600" />
                              {studio.owner.responseTime ? `Typically responds ${studio.owner.responseTime.toLowerCase()}` : 'No response time'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500">No host information available.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeSection === 'facilities' && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Studio Facilities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studio.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                          <FiGrid />
                        </div>
                        <span>{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studio.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mr-3">
                          <FiCheckCircle />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {studio.images.map((image, index) => (
                      <motion.div 
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img 
                          src={image.url} 
                          alt={image.caption || `Studio image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onClick={() => setSelectedImage(index)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeSection === 'reviews' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Reviews</h2>
                  <div className="flex items-center text-amber-500">
                    <FiStar className="mr-1 fill-current" />
                    <span className="font-bold">{studio.averageRating}</span>
                    <span className="text-gray-600 ml-1">({studio.ratingCount} reviews)</span>
                  </div>
                </div>
                
                {studio.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6">
                    <div className="flex items-start">
                      <img 
                        src={review.user.avatar} 
                        alt={review.user.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{review.user.name}</h3>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex text-amber-500 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i}
                              className={`${i < review.rating ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <button className="btn btn-outline flex items-center mx-auto">
                    <FiMessageCircle className="mr-2" /> Write a Review
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeSection === 'location' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="bg-gray-200 h-80 rounded-xl mb-6 overflow-hidden">
                  <iframe 
                    title="Studio Location"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${studio.location.address},${studio.location.city},Sri+Lanka`}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">Address</h3>
                  <p className="text-gray-600">{studio.location.address}, {studio.location.city}</p>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FiClock className="text-primary-600 mt-1 mr-3" />
                    <div>
                      <span className="block font-medium">Operating Hours</span>
                      <span className="text-gray-600">10:00 AM - 10:00 PM</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiDollarSign className="text-primary-600 mt-1 mr-3" />
                    <div>
                      <span className="block font-medium">Pricing</span>
                      <span className="text-gray-600">Rs. {studio.pricePerHour} per hour</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiTruck className="text-primary-600 mt-1 mr-3" />
                    <div>
                      <span className="block font-medium">Equipment Rental</span>
                      <span className="text-gray-600">Available at additional cost</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiUser className="text-primary-600 mt-1 mr-3" />
                    <div>
                      <span className="block font-medium">Staff</span>
                      <span className="text-gray-600">Sound engineer available</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Studio Policy</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <FiCheckCircle className="text-primary-600 mr-2" />
                    48 hour cancellation policy
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-primary-600 mr-2" />
                    No smoking inside
                  </li>
                  <li className="flex items-center">
                    <FiCheckCircle className="text-primary-600 mr-2" />
                    Equipment damage will be charged
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetailsPage;
