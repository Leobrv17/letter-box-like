import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import StarRating from '../components/StarRating.jsx';

const MovieDetail = () => {
  const { imdbId } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [status, setStatus] = useState('loading');

  const isFavorited = useMemo(
    () => favorites.some((fav) => fav.imdbId === imdbId),
    [favorites, imdbId]
  );
  const isWatchlisted = useMemo(
    () => watchlist.some((entry) => entry.imdbId === imdbId),
    [watchlist, imdbId]
  );

  useEffect(() => {
    let active = true;
    Promise.all([
      api.fetchMovie(imdbId),
      api.fetchReviews({ imdbId, limit: 20, page: 1 }),
      user ? api.fetchFavorites() : Promise.resolve({ favorites: [] }),
      user ? api.fetchWatchlist() : Promise.resolve({ watchlist: [] })
    ])
      .then(([movieData, reviewData, favoriteData, watchlistData]) => {
        if (active) {
          setMovie(movieData);
          setReviews(reviewData.reviews || []);
          setFavorites(favoriteData.favorites || []);
          setWatchlist(watchlistData.watchlist || []);
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

  const toggleWatchlist = async () => {
    if (!user) return;
    if (isWatchlisted) {
      await api.removeFromWatchlist(imdbId);
    } else {
      await api.addToWatchlist(imdbId);
    }
    const { watchlist: updated } = await api.fetchWatchlist();
    setWatchlist(updated || []);
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Movie not found.</p>;

  return (
    <section>
      <h1>{movie.Title}</h1>
      <p>{movie.Plot}</p>
      <p>Year: {movie.Year}</p>
      <StarRating rating={movie.imdbRating} max={10} label="IMDb" />
      {user && (
        <div className="button-row">
          <button type="button" onClick={toggleFavorite}>
            {isFavorited ? 'Unlike' : 'Like'}
          </button>
          <button type="button" className="secondary" onClick={toggleWatchlist}>
            {isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          </button>
        </div>
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
