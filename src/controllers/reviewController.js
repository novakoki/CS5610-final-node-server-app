import Review from '../models/Review.js';
import { findOrCreateLocalBook } from '../utils/bookUtils.js';
import Follow from '../models/Follow.js';

export async function createReview(req, res) {
  const { googleId, comment } = req.body;

  if (!googleId) {
    return res.status(400).json({ error: 'googleId is required' });
  }
  if (!comment || comment.length < 1) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  try {
    const book = await findOrCreateLocalBook(googleId);

    const review = await Review.create({
      user: req.user.id,
      book: book._id,
      comment,
    });

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getFollowingReviews(req, res) {
  try {
    const follows = await Follow.find({ follower: req.user.id });
    const followingIds = follows.map((f) => f.following);
    const reviews = await Review.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('book');
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getReviewsForBook(req, res) {
  try {
    const { googleId } = req.params;

    const book = await findOrCreateLocalBook(googleId);

    if (!book) {
      return res.json({ reviews: [] });
    }

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username role name')
      .sort({ createdAt: 'desc' });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getMyReviews(req, res) {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate('book');
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate('user', 'username').populate('book');
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getReviewsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId }).populate('book').populate('user');
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && !['ADMIN', 'MODERATOR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
}


