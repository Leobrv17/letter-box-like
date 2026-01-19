import React, { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import MovieCard from '../components/MovieCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedStatus, setLikedStatus] = useState('idle');
  const { user } = useAuth();

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

  useEffect(() => {
    let active = true;
    if (!user) {
      setLikedMovies([]);
      setLikedStatus('idle');
      return () => {
        active = false;
      };
    }
    setLikedStatus('loading');
    api
      .fetchFavorites()
      .then(async ({ favorites }) => {
        const entries = favorites || [];
        const movies = await Promise.all(
          entries.slice(0, 6).map(async (favorite) => {
            try {
              const movie = await api.fetchMovie(favorite.imdbId);
              return { ...movie, imdbId: favorite.imdbId };
            } catch (error) {
              return null;
            }
          })
        );
        if (active) {
          setLikedMovies(movies.filter(Boolean));
          setLikedStatus('ready');
        }
      })
      .catch(() => {
        if (active) {
          setLikedStatus('error');
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <section>
      <h1>Latest public reviews</h1>
      {user && (
        <div className="panel">
          <h2>Your liked movies</h2>
          {likedStatus === 'loading' && <p>Loading liked movies...</p>}
          {likedStatus === 'error' && <p>Unable to load your liked movies.</p>}
          {likedStatus === 'ready' && likedMovies.length === 0 && (
            <p>You have not liked any movies yet.</p>
          )}
          {likedMovies.length > 0 && (
            <div className="grid two">
              {likedMovies.map((movie) => (
                <MovieCard key={movie.imdbID || movie.imdbId} movie={movie} linkLabel="Open" />
              ))}
            </div>
          )}
        </div>
      )}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Unable to load reviews.</p>}
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </section>
  );
};

export default Home;
