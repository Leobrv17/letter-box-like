import express from 'express';
import Review from '../models/Review.js';
import { authMiddleware } from '../middleware/auth.js';
import { reviewValidation } from '../validators/review.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 20);
    const page = Number(req.query.page || 1);
    const imdbId = req.query.imdbId;
    const query = { visibility: 'public' };
    if (imdbId) {
      query.imdbId = imdbId;
    }
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'username');
    const total = await Review.countDocuments(query);
    return res.json({ reviews, total, page, limit });
  } catch (error) {
    return next(error);
  }
});

router.get('/mine', authMiddleware, async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('userId', 'username');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.visibility === 'private') {
      return res.status(403).json({ message: 'Review is private' });
    }
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

router.post('/', authMiddleware, reviewValidation, validate, async (req, res, next) => {
  try {
    const { imdbId, titleSnapshot, rating, text, visibility } = req.body;
    const review = await Review.create({
      userId: req.user.id,
      imdbId,
      titleSnapshot,
      rating,
      text,
      visibility: visibility || 'public'
    });
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authMiddleware, reviewValidation, validate, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { imdbId, titleSnapshot, rating, text, visibility } = req.body;
    review.imdbId = imdbId;
    review.titleSnapshot = titleSnapshot;
    review.rating = rating;
    review.text = text;
    review.visibility = visibility || review.visibility;
    await review.save();
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    return res.json({ message: 'Review deleted' });
  } catch (error) {
    return next(error);
  }
});

export default router;
