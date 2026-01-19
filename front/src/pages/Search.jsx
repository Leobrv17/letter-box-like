import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/index.js';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query) return;
    setStatus('loading');
    try {
      const data = await api.searchMovies(query, 1);
      setResults(data.results || []);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section>
      <h1>Search movies</h1>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title"
        />
        <button type="submit">Search</button>
      </form>
      {status === 'loading' && <p>Searching...</p>}
      {status === 'error' && <p>Search failed.</p>}
      <div className="grid two">
        {results.map((movie) => (
          <div className="card" key={movie.imdbID}>
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <Link to={`/movie/${movie.imdbID}`}>Open</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Search;
