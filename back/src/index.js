import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import favoriteRoutes from './routes/favorites.js';

import { notFoundHandler, errorHandler } from './middleware/errors.js';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const { PORT = 4000, MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
