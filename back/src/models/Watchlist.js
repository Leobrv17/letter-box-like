import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imdbId: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

watchlistSchema.index({ userId: 1, imdbId: 1 }, { unique: true });

export default mongoose.model('Watchlist', watchlistSchema);
