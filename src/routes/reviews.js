import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/reviewController.js';

export default function ReviewRoutes(app) {
  app.post('/api/reviews', authenticate, controller.createReview);
  app.get('/api/reviews/following', authenticate, controller.getFollowingReviews);
  app.get('/api/reviews/book/:googleId', controller.getReviewsForBook);
  app.get('/api/reviews', controller.getAllReviews);
  app.get('/api/reviews/me', authenticate, controller.getMyReviews);
  app.get('/api/reviews/user/:userId', controller.getReviewsByUserId);
  app.delete('/api/reviews/:reviewId', authenticate, controller.deleteReview);
}


