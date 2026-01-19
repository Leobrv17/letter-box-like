import express from 'express';
import Favorite from '../models/Favorite.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ favorites });
  } catch (error) {
    return next(error);
  }
});

router.post('/:imdbId', authMiddleware, async (req, res, next) => {
  try {
    const favorite = await Favorite.create({ userId: req.user.id, imdbId: req.params.imdbId });
    return res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already favorited' });
    }
    return next(error);
  }
});

router.delete('/:imdbId', authMiddleware, async (req, res, next) => {
  try {
    await Favorite.deleteOne({ userId: req.user.id, imdbId: req.params.imdbId });
    return res.json({ message: 'Favorite removed' });
  } catch (error) {
    return next(error);
  }
});

export default router;
