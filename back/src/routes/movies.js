import express from 'express';
import { createOmdbProvider } from '../services/omdbProvider.js';

const router = express.Router();
let provider;

const getProvider = () => {
  if (!provider) {
    provider = createOmdbProvider();
  }
  return provider;
};

router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page || 1);
    if (!query) {
      return res.status(400).json({ message: 'Query parameter q required' });
    }
    const data = await getProvider().searchMovies(query, page);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get('/:imdbId', async (req, res, next) => {
  try {
    const movie = await getProvider().getMovie(req.params.imdbId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.json(movie);
  } catch (error) {
    return next(error);
  }
});

export default router;
