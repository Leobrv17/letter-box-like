import React from 'react';

const buildStars = (filledCount) =>
  Array.from({ length: 5 }, (_, index) => (index < filledCount ? '★' : '☆')).join('');

const StarRating = ({ rating, max = 10, label = 'Rating' }) => {
  if (rating === null || rating === undefined || Number.isNaN(Number(rating))) {
    return (
      <p className="rating">
        <span className="rating__stars">{buildStars(0)}</span>
        <span className="rating__label">{label}: N/A</span>
      </p>
    );
  }

  const normalized = (Number(rating) / max) * 5;
  const filled = Math.max(0, Math.min(5, Math.round(normalized)));

  return (
    <p className="rating">
      <span className="rating__stars">{buildStars(filled)}</span>
      <span className="rating__label">
        {label}: {normalized.toFixed(1)} / 5
      </span>
    </p>
  );
};

export default StarRating;
