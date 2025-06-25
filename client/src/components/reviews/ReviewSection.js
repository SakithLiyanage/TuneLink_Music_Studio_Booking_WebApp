import React from 'react';
import { FiStar } from 'react-icons/fi';

const ReviewSection = ({ reviews = [], averageRating = 0, reviewCount = 0 }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
    <div className="flex items-center mb-4">
      <FiStar className="text-amber-500 mr-1" />
      <span className="font-bold text-lg">{averageRating}</span>
      <span className="ml-2 text-gray-500">({reviewCount} reviews)</span>
    </div>
    <div className="space-y-4">
      {reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <img src={review.user.image} alt={review.user.name} className="w-8 h-8 rounded-full mr-2" />
            <span className="font-medium">{review.user.name}</span>
            <span className="ml-2 flex items-center text-amber-500 text-sm">
              <FiStar className="mr-1" /> {review.rating}
            </span>
            <span className="ml-auto text-xs text-gray-400">{review.date}</span>
          </div>
          <div className="text-gray-700">{review.text}</div>
        </div>
      ))}
    </div>
  </div>
);

export default ReviewSection;
