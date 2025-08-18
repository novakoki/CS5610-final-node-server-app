import Favorite from '../models/Favorite.js';
import { findOrCreateLocalBook } from '../utils/bookUtils.js';

export async function addFavorite(req, res) {
  const { googleId } = req.body;
  if (!googleId) {
    return res.status(400).json({ error: 'googleId is required' });
  }

  try {
    const book = await findOrCreateLocalBook(googleId);
    const existing = await Favorite.findOne({ user: req.user.id, book: book._id });
    if (existing) {
      return res.status(200).json({ favorite: existing });
    }
    const favorite = await Favorite.create({
      user: req.user.id,
      book: book._id,
    });
    res.status(201).json({ favorite });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function removeFavorite(req, res) {
  const { googleId } = req.params;
  try {
    const book = await findOrCreateLocalBook(googleId);
    await Favorite.deleteOne({ user: req.user.id, book: book._id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getMyFavorites(req, res) {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate('book');
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getFavoritesForBook(req, res) {
  try {
    const { googleId } = req.params;
    const book = await findOrCreateLocalBook(googleId);
    const favorites = await Favorite.find({ book: book._id }).populate('user', 'username');
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
