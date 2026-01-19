import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';

const router = express.Router();

router.get('/:username/public', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      'username createdAt'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const reviews = await Review.find({ userId: user._id, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    return res.json({ user, reviews });
  } catch (error) {
    return next(error);
  }
});

export default router;
