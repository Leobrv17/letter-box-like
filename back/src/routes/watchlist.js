import express from 'express';
import Watchlist from '../models/Watchlist.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ watchlist });
  } catch (error) {
    return next(error);
  }
});

router.post('/:imdbId', authMiddleware, async (req, res, next) => {
  try {
    const entry = await Watchlist.create({ userId: req.user.id, imdbId: req.params.imdbId });
    return res.status(201).json(entry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already in watchlist' });
    }
    return next(error);
  }
});

router.delete('/:imdbId', authMiddleware, async (req, res, next) => {
  try {
    await Watchlist.deleteOne({ userId: req.user.id, imdbId: req.params.imdbId });
    return res.json({ message: 'Watchlist entry removed' });
  } catch (error) {
    return next(error);
  }
});

export default router;
