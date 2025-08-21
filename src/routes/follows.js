import { protect } from '../middleware/auth.js';
import * as controller from '../controllers/followController.js';

export default function FollowRoutes(app) {
  app.post('/api/follows/:targetUserId', protect, controller.follow);
  app.delete('/api/follows/:targetUserId', protect, controller.unfollow);
  app.get('/api/follows/status/:targetUserId', protect, controller.checkStatus);
  app.get('/api/follows/followers/:userId', controller.getFollowers);
  app.get('/api/follows/following/:userId', controller.getFollowing);
}
