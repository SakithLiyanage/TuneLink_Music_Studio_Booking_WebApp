import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { FiCalendar, FiHome, FiEdit, FiClock, FiChevronRight } from 'react-icons/fi';

const StudioDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await bookingsAPI.getStudioBookings();
        setBookings(res.data.data || []);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Studio Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage your studio bookings and profile</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/studio/profile" className="bg-white p-5 rounded-xl shadow-soft flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            <FiHome size={22} />
          </div>
          <div>
            <h3 className="font-semibold">Edit Profile</h3>
            <p className="text-gray-600 text-sm">Update your studio info</p>
          </div>
          <FiChevronRight className="ml-auto text-gray-400" />
        </Link>
        <Link to="/studio/bookings" className="bg-white p-5 rounded-xl shadow-soft flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
            <FiCalendar size={22} />
          </div>
          <div>
            <h3 className="font-semibold">My Bookings</h3>
            <p className="text-gray-600 text-sm">View and manage bookings</p>
          </div>
          <FiChevronRight className="ml-auto text-gray-400" />
        </Link>
        <Link to="/studio/availability" className="bg-white p-5 rounded-xl shadow-soft flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
            <FiClock size={22} />
          </div>
          <div>
            <h3 className="font-semibold">Set Availability</h3>
            <p className="text-gray-600 text-sm">Update your schedule</p>
          </div>
          <FiChevronRight className="ml-auto text-gray-400" />
        </Link>
      </div>
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
        {loading ? (
          <div className="bg-white rounded-xl shadow-soft p-6 flex justify-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.slice(0, 4).map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{booking.client?.name || 'Client'}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <FiCalendar className="mr-1" size={14} />
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div className="mt-2 text-right">
                      <Link to={`/studio/bookings/${booking._id}`} className="text-primary-600 text-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <FiCalendar className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="font-medium mb-1">No Upcoming Bookings</h3>
            <p className="text-gray-600 text-sm mb-4">You have no upcoming bookings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioDashboard;
