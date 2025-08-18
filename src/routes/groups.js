import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/groupController.js';

export default function GroupRoutes(app) {
  app.get('/api/groups', authenticate, controller.listGroups);
  app.get('/api/groups/:groupId', controller.getGroup);
  app.get('/api/groups/:groupId/members', controller.listMembers);
  app.post('/api/groups', authenticate, controller.createGroup);
  app.post('/api/groups/:groupId/join', authenticate, controller.joinGroup);
  app.delete('/api/groups/:groupId/leave', authenticate, controller.leaveGroup);
}
