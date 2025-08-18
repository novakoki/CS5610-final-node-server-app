import * as controller from '../controllers/googleBooksController.js';

export default function GoogleBooksRoutes(app) {
  app.get('/api/google-books/search', controller.search);
  app.get('/api/google-books/details/:googleId', controller.details);
}


