import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
