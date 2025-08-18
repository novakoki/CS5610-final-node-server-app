import mongoose from 'mongoose';

const AuthorBookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

AuthorBookSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('AuthorBook', AuthorBookSchema);
