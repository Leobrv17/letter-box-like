import React, { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import ReviewCard from '../components/ReviewCard.jsx';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .fetchReviews({ limit: 20, page: 1 })
      .then((data) => {
        if (active) {
          setReviews(data.reviews || []);
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
  }, []);

  return (
    <section>
      <h1>Latest public reviews</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Unable to load reviews.</p>}
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </section>
  );
};

export default Home;
