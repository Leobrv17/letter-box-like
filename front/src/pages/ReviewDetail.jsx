import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/index.js';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .fetchReview(id)
      .then((data) => {
        if (active) {
          setReview(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Review not found.</p>;

  return (
    <section>
      <h1>{review.titleSnapshot}</h1>
      <p>Rating: {review.rating ?? 'N/A'}</p>
      <p>{review.text}</p>
      <p>
        Movie: <Link to={`/movie/${review.imdbId}`}>{review.imdbId}</Link>
      </p>
      {review.userId?.username && (
        <p>
          Author: <Link to={`/profile/${review.userId.username}`}>{review.userId.username}</Link>
        </p>
      )}
    </section>
  );
};

export default ReviewDetail;
