import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/followController.js';

export default function FollowRoutes(app) {
  app.post('/api/follows/:targetUserId', authenticate, controller.follow);
  app.delete('/api/follows/:targetUserId', authenticate, controller.unfollow);
  app.get('/api/follows/status/:targetUserId', authenticate, controller.checkStatus);
  app.get('/api/follows/followers/:userId', controller.getFollowers);
  app.get('/api/follows/following/:userId', controller.getFollowing);
}
