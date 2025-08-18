import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/authController.js';

export default function AuthRoutes(app) {
  app.post('/api/auth/register', controller.register);
  app.post('/api/auth/login', controller.login);
  app.post('/api/auth/logout', controller.logout);
  app.get('/api/auth/me', authenticate, controller.me);
  app.put('/api/auth/me', authenticate, controller.updateMe);
  app.get('/api/auth/users', controller.listAllUsers);
  app.get('/api/auth/users/recent', controller.listRecentUsers);
  app.get('/api/auth/users/:id', controller.publicProfile);
}


