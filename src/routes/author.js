import { protect, author } from '../middleware/auth.js';
import * as controller from '../controllers/authorController.js';

export default function AuthorRoutes(app) {
  app.post('/api/author/claim', protect, author, controller.claimBook);
  app.get('/api/author/books/:userId', controller.getClaimedBooks);
  app.get('/api/author/reviews', protect, author, controller.getClaimedBookReviews);
}
