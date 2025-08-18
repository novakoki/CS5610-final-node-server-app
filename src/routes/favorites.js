import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/favoriteController.js';

export default function FavoriteRoutes(app) {
  app.get('/api/favorites/me', authenticate, controller.getMyFavorites);
  app.get('/api/favorites/book/:googleId', controller.getFavoritesForBook);
  app.post('/api/favorites', authenticate, controller.addFavorite);
  app.delete('/api/favorites/:googleId', authenticate, controller.removeFavorite);
}
