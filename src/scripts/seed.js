
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import Group from '../models/Group.js';
import GroupMembership from '../models/GroupMembership.js';
import Follow from '../models/Follow.js';
import Favorite from '../models/Favorite.js';
import connectDB from '../config/db.js';
import { searchBooks } from '../services/googleBooksService.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    await Group.deleteMany({});
    await GroupMembership.deleteMany({});
    await Follow.deleteMany({});
    await Favorite.deleteMany({});
    console.log('Database cleared');

    // Create users
    const password = await bcrypt.hash('password', 10);
    const mockUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        name: 'Admin User',
        bio: 'I am the site administrator.',
        role: 'ADMIN',
      },
      {
        username: 'moderator',
        email: 'moderator@example.com',
        name: 'Moderator Max',
        bio: 'Keeping the community clean.',
        role: 'MODERATOR',
      },
      {
        username: 'janedoe',
        email: 'jane.d@example.com',
        name: 'Jane Doe',
        bio: 'Award-winning author of several fantasy novels.',
        role: 'AUTHOR',
      },
      {
        username: 'johnsmith',
        email: 'john.s@example.com',
        name: 'John Smith',
        bio: 'Historical fiction writer and enthusiast.',
        role: 'AUTHOR',
      },
      {
        username: 'alice',
        email: 'alice@example.com',
        name: 'Alice',
        bio: 'Just a girl who loves to read.',
        role: 'READER',
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        name: 'Bob',
        bio: 'Sci-fi and fantasy are my jam.',
        role: 'READER',
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        name: 'Charlie',
        bio: 'Lover of classic literature.',
        role: 'READER',
      },
      {
        username: 'diana',
        email: 'diana@example.com',
        name: 'Diana',
        bio: 'Always looking for a new book to devour.',
        role: 'READER',
      },
      {
        username: 'evan',
        email: 'evan@example.com',
        name: 'Evan',
        bio: 'I read everything and anything.',
        role: 'READER',
      },
      {
        username: 'frank',
        email: 'frank@example.com',
        name: 'Frank',
        bio: 'My favorite place is the library.',
        role: 'READER',
      },
    ];

    const users = mockUsers.map((user) => new User({ ...user, password }));
    const createdUsers = await User.insertMany(users);
    console.log('Users created');

    // Create books from Google Books API
    const bookData = await searchBooks('best seller');
    const books = bookData.items.map((item) => ({
      googleId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || '',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
    }));

    const createdBooks = await Book.insertMany(books);
    console.log('Books created');

    // Create reviews
    const reviews = [];
    const reviewComments = [
      'An absolute masterpiece! A must-read for everyone.',
      'A bit slow to start, but the ending was mind-blowing.',
      'I couldn’t put this book down. The characters are so well-developed.',
      'Interesting concept, but the execution was lacking.',
      'A heartwarming story that will stay with you long after you finish it.',
      'I have mixed feelings about this one. Some parts were brilliant, others not so much.',
      'The world-building is incredible. I felt like I was right there with the characters.',
      'A disappointing read. I had high hopes, but it fell flat for me.',
      'This book made me laugh, cry, and think. A truly wonderful experience.',
      'A solid 4-star read. Enjoyable, but not life-changing.',
      'I can see why this book is so popular. It’s a real page-turner.',
      'The writing style was not for me, but I appreciate the story it was trying to tell.',
      'A powerful and moving story that tackles important themes.',
      'This was a fun, lighthearted read. Perfect for a vacation.',
      'I was on the edge of my seat the whole time. The suspense is masterful.',
      'The plot was a bit predictable, but I still enjoyed the journey.',
      'A beautiful and lyrical book. The prose is simply stunning.',
      'I wanted to love this book, but I just couldn’t connect with the main character.',
      'A thought-provoking read that will make you question everything.',
      'This is one of those books that will be talked about for years to come.',
    ];

    const reviewedPairs = new Set();
    while (reviews.length < 50) {
      const userIndex = Math.floor(Math.random() * createdUsers.length);
      const bookIndex = Math.floor(Math.random() * createdBooks.length);
      const pairKey = `${createdUsers[userIndex]._id}-${createdBooks[bookIndex]._id}`;
      if (!reviewedPairs.has(pairKey)) {
        reviews.push(
          new Review({
            user: createdUsers[userIndex]._id,
            book: createdBooks[bookIndex]._id,
            comment: reviewComments[reviews.length % reviewComments.length],
          }),
        );
        reviewedPairs.add(pairKey);
      }
    }

    await Review.insertMany(reviews);
    console.log('Reviews created');

    // Create groups
    const groups = [];
    for (let i = 0; i < 5; i++) {
      groups.push(
        new Group({
          name: `Book Club ${i}`,
          description: `This is a book club for discussing interesting books. This is group ${i}.`,
          owner: createdUsers[i]._id,
          currentBook: createdBooks[i]._id,
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        })
      );
    }
    const createdGroups = await Group.insertMany(groups);
    console.log('Groups created');

    // Create group memberships
    const groupMemberships = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        // Each group has 5 members
        groupMemberships.push(
          new GroupMembership({
            group: createdGroups[i]._id,
            member: createdUsers[j]._id,
          })
        );
      }
    }
    await GroupMembership.insertMany(groupMemberships);
    console.log('Group memberships created');

    // Create follows
    const follows = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (i !== j && Math.random() > 0.5) {
          follows.push(
            new Follow({
              follower: createdUsers[i]._id,
              following: createdUsers[j]._id,
            }),
          );
        }
      }
    }
    await Follow.insertMany(follows);
    console.log('Follows created');

    // Create favorites
    const favorites = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.5) {
          favorites.push(
            new Favorite({
              user: createdUsers[i]._id,
              book: createdBooks[j]._id,
            }),
          );
        }
      }
    }
    await Favorite.insertMany(favorites);
    console.log('Favorites created');

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();

export default seedDatabase;
