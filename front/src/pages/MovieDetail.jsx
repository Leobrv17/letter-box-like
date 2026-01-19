import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import ReviewCard from '../components/ReviewCard.jsx';

const MovieDetail = () => {
  const { imdbId } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [status, setStatus] = useState('loading');

  const isFavorited = useMemo(
    () => favorites.some((fav) => fav.imdbId === imdbId),
    [favorites, imdbId]
  );

  useEffect(() => {
    let active = true;
    Promise.all([
      api.fetchMovie(imdbId),
      api.fetchReviews({ imdbId, limit: 20, page: 1 }),
      user ? api.fetchFavorites() : Promise.resolve({ favorites: [] })
    ])
      .then(([movieData, reviewData, favoriteData]) => {
        if (active) {
          setMovie(movieData);
          setReviews(reviewData.reviews || []);
          setFavorites(favoriteData.favorites || []);
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
  }, [imdbId, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    if (isFavorited) {
      await api.removeFavorite(imdbId);
    } else {
      await api.addFavorite(imdbId);
    }
    const { favorites: updated } = await api.fetchFavorites();
    setFavorites(updated || []);
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Movie not found.</p>;

  return (
    <section>
      <h1>{movie.Title}</h1>
      <p>{movie.Plot}</p>
      <p>Year: {movie.Year}</p>
      {user && (
        <button type="button" onClick={toggleFavorite}>
          {isFavorited ? 'Remove favorite' : 'Add favorite'}
        </button>
      )}
      <h2>Reviews</h2>
      {reviews.length === 0 && <p>No public reviews yet.</p>}
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </section>
  );
};

export default MovieDetail;
