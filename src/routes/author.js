import { authenticate, authorize } from '../middleware/auth.js';
import * as controller from '../controllers/authorController.js';

export default function AuthorRoutes(app) {
  app.post('/api/author/claim', authenticate, authorize(['AUTHOR']), controller.claimBook);
  app.get('/api/author/books/:userId', controller.getClaimedBooks);
  app.get('/api/author/reviews', authenticate, authorize(['AUTHOR']), controller.getClaimedBookReviews);
}
