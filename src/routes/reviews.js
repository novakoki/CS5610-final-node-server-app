import { protect } from '../middleware/auth.js';
import * as controller from '../controllers/reviewController.js';

export default function ReviewRoutes(app) {
  app.post('/api/reviews', protect, controller.createReview);
  app.get('/api/reviews/following', protect, controller.getFollowingReviews);
  app.get('/api/reviews/book/:googleId', controller.getReviewsForBook);
  app.get('/api/reviews', controller.getAllReviews);
  app.get('/api/reviews/me', protect, controller.getMyReviews);
  app.get('/api/reviews/user/:userId', controller.getReviewsByUserId);
  app.delete('/api/reviews/:reviewId', protect, controller.deleteReview);
}


