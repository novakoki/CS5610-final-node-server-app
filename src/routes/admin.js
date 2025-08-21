import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';

export default function AdminRoutes(app) {
  app.get('/api/admin/users', protect, admin, async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json({ users: users.map((u) => u.toPublicJSON()) });
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
}


