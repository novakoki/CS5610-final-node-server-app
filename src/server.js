import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDatabase from './config/db.js';

import AuthRoutes from './routes/auth.js';
import googleBooksRoutes from './routes/googleBooks.js';
import reviewRoutes from './routes/reviews.js';
import bookRoutes from './routes/books.js';
import adminRoutes from './routes/admin.js';
import favoriteRoutes from './routes/favorites.js';
import groupRoutes from './routes/groups.js';
import followRoutes from './routes/follows.js';
import authorRoutes from './routes/author.js';
import * as authController from './controllers/authController.js';

const app = express();

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

AuthRoutes(app);
googleBooksRoutes(app);
reviewRoutes(app);
bookRoutes(app);
adminRoutes(app);
favoriteRoutes(app);
groupRoutes(app);
followRoutes(app);
authorRoutes(app);

app.get('/api/users', authController.listAllUsers);
app.get('/api/users/:id', authController.publicProfile);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const message = err.message || 'Internal Server Error';
  const status = err.status || 500;
  res.status(status).json({ error: message });
});

async function startServer() {
  try {
    await connectToDatabase();
    console.log('Successfully connected to the database.');

    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Server is not started.', error);
    process.exit(1);
  }
}

startServer();


