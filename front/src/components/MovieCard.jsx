import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

const MovieCard = ({ movie, linkLabel = 'Open', showPlot = false }) => {
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
  const imdbId = movie.imdbID || movie.imdbId;

  return (
    <div className="card movie-card">
      <div className="movie-card__body">
        <div className="movie-card__poster">
          {poster ? <img src={poster} alt={`Poster for ${movie.Title}`} /> : <span>No poster</span>}
        </div>
        <div>
          <h3>{movie.Title}</h3>
          <p className="muted">{movie.Year}</p>
          <StarRating rating={movie.imdbRating} max={10} label="IMDb" />
          {showPlot && movie.Plot && <p className="muted">{movie.Plot}</p>}
          {imdbId && <Link to={`/movie/${imdbId}`}>{linkLabel}</Link>}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
