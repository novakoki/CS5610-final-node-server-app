import AuthorBook from '../models/AuthorBook.js';
import { findOrCreateLocalBook } from '../utils/bookUtils.js';
import Review from '../models/Review.js';

export async function claimBook(req, res) {
  try {
    const { googleId } = req.body;
    if (!googleId) {
      return res.status(400).json({ error: 'googleId is required' });
    }

    const book = await findOrCreateLocalBook(googleId);

    const existingClaim = await AuthorBook.findOne({
      user: req.user.id,
      book: book._id,
    });

    if (existingClaim) {
      return res.status(400).json({ error: 'You have already claimed this book' });
    }

    await AuthorBook.create({
      user: req.user.id,
      book: book._id,
    });

    res.status(201).json({ message: 'Book claimed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getClaimedBooks(req, res) {
  try {
    const { userId } = req.params;
    const claims = await AuthorBook.find({ user: userId }).populate('book');
    res.json({ books: claims.map((c) => c.book) });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getClaimedBookReviews(req, res) {
  try {
    const claims = await AuthorBook.find({ user: req.user.id });
    const bookIds = claims.map((c) => c.book);
    const reviews = await Review.find({ book: { $in: bookIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'username role')
      .populate('book');
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
