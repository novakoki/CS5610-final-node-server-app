import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Favorite', FavoriteSchema);
