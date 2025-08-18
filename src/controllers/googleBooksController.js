import { searchBooks, getBookDetails } from '../services/googleBooksService.js';

export async function search(req, res) {
  try {
    const q = String(req.query.q || '').trim();

    if (!q) {
      return res.status(400).json({ error: 'Missing search query parameter "q"' });
    }

    const startIndex = Number(req.query.startIndex || 0);
    const maxResults = Math.min(Number(req.query.maxResults || 20), 40);

    const data = await searchBooks(q, startIndex, maxResults);
    res.json(data);
  } catch (error) {
    console.error('Error in Google Books search:', error);
    res.status(500).json({ error: 'Failed to search for books' });
  }
}

export async function details(req, res) {
  try {
    const { googleId } = req.params;
    const data = await getBookDetails(googleId);
    res.json(data);
  } catch (error) {
    console.error('Error getting book details:', error);
    res.status(500).json({ error: 'Failed to get book details' });
  }
}


