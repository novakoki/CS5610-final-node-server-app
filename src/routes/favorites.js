import { protect } from '../middleware/auth.js';
import * as controller from '../controllers/favoriteController.js';

export default function FavoriteRoutes(app) {
  app.get('/api/favorites/me', protect, controller.getMyFavorites);
  app.get('/api/favorites/book/:googleId', controller.getFavoritesForBook);
  app.post('/api/favorites', protect, controller.addFavorite);
  app.delete('/api/favorites/:googleId', protect, controller.removeFavorite);
}
