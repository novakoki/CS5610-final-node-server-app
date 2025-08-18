import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(user) {
  const payload = { id: user._id, username: user.username, role: user.role };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

export async function register(req, res) {
  const { username, email, password, role, name } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  if (role && !['READER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'READER',
      name,
    });

    const token = signToken(user);

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: user.toPublicJSON(), token });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Please provide a username/email and password' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: user.toPublicJSON(), token });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token').json({ ok: true });
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function updateMe(req, res) {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function publicProfile(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function listRecentUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    res.json({ users: users.map((u) => u.toPublicJSON()) });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function listAllUsers(req, res) {
  try {
    const { q } = req.query;
    const filter = q ? { username: { $regex: q, $options: 'i' } } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ users: users.map((u) => u.toPublicJSON()) });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}


