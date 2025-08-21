import { protect } from '../middleware/auth.js';
import * as controller from '../controllers/groupController.js';

export default function GroupRoutes(app) {
  app.get('/api/groups', protect, controller.listGroups);
  app.get('/api/groups/:groupId', controller.getGroup);
  app.get('/api/groups/:groupId/members', controller.listMembers);
  app.post('/api/groups', protect, controller.createGroup);
  app.post('/api/groups/:groupId/join', protect, controller.joinGroup);
  app.delete('/api/groups/:groupId/leave', protect, controller.leaveGroup);
}
