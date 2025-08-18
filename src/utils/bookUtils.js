import Book from '../models/Book.js';
import { getBookDetails } from '../services/googleBooksService.js';

export async function findOrCreateLocalBook(googleId) {
  let book = await Book.findOne({ googleId });
  if (!book) {
    const data = await getBookDetails(googleId);
    const volumeInfo = data.volumeInfo || {};
    book = await Book.create({
      googleId,
      title: volumeInfo.title || 'Untitled',
      authors: volumeInfo.authors || [],
      description: volumeInfo.description || '',
      thumbnail: (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) || '',
    });
  }
  return book;
}
