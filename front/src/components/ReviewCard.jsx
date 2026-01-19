import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

const ReviewCard = ({ review }) => {
  return (
    <div className="card">
      <h3>
        <Link to={`/review/${review._id}`}>{review.titleSnapshot}</Link>
      </h3>
      <StarRating rating={review.rating} max={10} label="Review" />
      <p>{review.text}</p>
      {review.userId?.username && (
        <p>
          by <Link to={`/profile/${review.userId.username}`}>{review.userId.username}</Link>
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
