import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    authors: [{ type: String }],
    description: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Book', BookSchema);


