import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await bookingsAPI.getMyBookings();
        setBookings(res.data.data || []);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.delete(id);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await bookingsAPI.updatePayment(id, { paymentStatus: 'paid', paymentMethod: 'online', paymentId: 'MOCK123' });
      setBookings(bookings.map(b => b._id === id ? { ...b, paymentStatus: 'paid' } : b));
    } catch (err) {
      setError('Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  const handleReview = async (id) => {
    setReviewingId(id);
    try {
      await bookingsAPI.update(id, { rating: { rating: reviewRating, review: reviewText } });
      setBookings(bookings.map(b => b._id === id ? { ...b, rating: { rating: reviewRating, review: reviewText } } : b));
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-soft">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2 border-b">Type</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Time</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Payment</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td className="p-2 border-b">{booking.artist ? 'Artist' : 'Studio'}</td>
                <td className="p-2 border-b">
                  {booking.artist ? (
                    <Link to={`/artists/${booking.artist._id}`}>{booking.artist.user?.name || 'Artist'}</Link>
                  ) : (
                    <Link to={`/studios/${booking.studio._id}`}>{booking.studio.name || 'Studio'}</Link>
                  )}
                </td>
                <td className="p-2 border-b">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="p-2 border-b">{booking.startTime} - {booking.endTime}</td>
                <td className="p-2 border-b">{booking.status}</td>
                <td className="p-2 border-b">{booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</td>
                <td className="p-2 border-b space-x-2">
                  {booking.paymentStatus !== 'paid' && (
                    <button className="btn btn-primary btn-xs" onClick={() => handlePay(booking._id)} disabled={payingId === booking._id}>
                      {payingId === booking._id ? 'Paying...' : 'Pay Now'}
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button className="btn btn-danger btn-xs" onClick={() => handleCancel(booking._id)}>
                      Cancel
                    </button>
                  )}
                  {booking.status === 'completed' && !booking.rating && (
                    <div>
                      <button className="btn btn-secondary btn-xs" onClick={() => setReviewingId(booking._id)}>
                        Leave Review
                      </button>
                      {reviewingId === booking._id && (
                        <div className="mt-2">
                          <input type="number" min={1} max={5} value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="w-16 p-1 border rounded mr-2" />
                          <input type="text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write a review..." className="p-1 border rounded mr-2" />
                          <button className="btn btn-primary btn-xs" onClick={() => handleReview(booking._id)} disabled={reviewingId === booking._id}>Submit</button>
                        </div>
                      )}
                    </div>
                  )}
                  {booking.status === 'completed' && booking.rating && (
                    <span className="text-green-700">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientBookings;
