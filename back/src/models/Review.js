import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imdbId: { type: String, required: true },
    titleSnapshot: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 },
    text: { type: String, required: true },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'public'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
