import React, { useState } from 'react';
import { api } from '../api/index.js';
import MovieCard from '../components/MovieCard.jsx';

const Search = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchResults = async (requestedPage, options = {}, replace = true) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await api.searchMovies(query, requestedPage, options);
      if (data.error) {
        setResults([]);
        setTotalResults(0);
        setStatus('error');
        setErrorMessage(data.error);
        return;
      }
      const incoming = data.results || [];
      setResults((prev) => (replace ? incoming : [...prev, ...incoming]));
      setTotalResults(data.totalResults || 0);
      setPage(requestedPage);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Search failed. Try again with a different query.');
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setErrorMessage('Please enter at least 2 characters.');
      setStatus('error');
      return;
    }
    await fetchResults(1, { year: year || undefined, type: type || undefined }, true);
  };

  const handleLoadMore = async () => {
    await fetchResults(page + 1, { year: year || undefined, type: type || undefined }, false);
  };

  const handleClear = () => {
    setQuery('');
    setYear('');
    setType('');
    setResults([]);
    setStatus('idle');
    setPage(1);
    setTotalResults(0);
    setErrorMessage('');
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
        <input
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Year (optional)"
        />
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
        <div className="button-row">
          <button type="submit">Search</button>
          <button type="button" className="secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
      {status === 'loading' && <p>Searching...</p>}
      {status === 'error' && <p>{errorMessage || 'Search failed.'}</p>}
      {status === 'ready' && (
        <p className="muted">
          {results.length} of {totalResults} results
        </p>
      )}
      {status === 'ready' && results.length === 0 && <p>No movies found.</p>}
      <div className="grid two">
        {results.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} linkLabel="Open" />
        ))}
      </div>
      {status === 'ready' && results.length < totalResults && results.length > 0 && (
        <button type="button" className="secondary" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </section>
  );
};

export default Search;
