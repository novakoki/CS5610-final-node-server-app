import Book from '../models/Book.js';

export default function BookRoutes(app) {
  app.get('/api/books', async (req, res) => {
    try {
      const books = await Book.find().sort({ createdAt: -1 }).limit(10);
      res.json({ books });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
}


