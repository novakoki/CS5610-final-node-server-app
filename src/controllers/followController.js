import Follow from '../models/Follow.js';
import User from '../models/User.js';

function toPublic(user) {
  return user.toPublicJSON ? user.toPublicJSON() : {
    _id: user._id,
    username: user.username,
    role: user.role,
    name: user.name,
  };
}

export async function follow(req, res) {
  const { targetUserId } = req.params;
  if (req.user.id === targetUserId) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }
  try {
    const target = await User.findById(targetUserId);
    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }
    const existing = await Follow.findOne({ follower: req.user.id, following: targetUserId });
    if (existing) {
      return res.json({ follow: existing });
    }
    const followDoc = await Follow.create({ follower: req.user.id, following: targetUserId });
    res.status(201).json({ follow: followDoc });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function unfollow(req, res) {
  const { targetUserId } = req.params;
  try {
    await Follow.deleteOne({ follower: req.user.id, following: targetUserId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getFollowers(req, res) {
  const { userId } = req.params;
  try {
    const followers = await Follow.find({ following: userId }).populate('follower');
    res.json({ followers: followers.map((f) => toPublic(f.follower)) });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function getFollowing(req, res) {
  const { userId } = req.params;
  try {
    const following = await Follow.find({ follower: userId }).populate('following');
    res.json({ following: following.map((f) => toPublic(f.following)) });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}

export async function checkStatus(req, res) {
  const { targetUserId } = req.params;
  try {
    const exists = await Follow.exists({ follower: req.user.id, following: targetUserId });
    res.json({ isFollowing: !!exists });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
