import Group from '../models/Group.js';
import GroupMembership from '../models/GroupMembership.js';
import { findOrCreateLocalBook } from '../utils/bookUtils.js';

export async function listGroups(req, res) {
  try {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const groups = await Group.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('owner', 'username')
      .populate('currentBook');
    res.json({ groups: groups.map((g) => g.toPublicJSON()) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
}

export async function getGroup(req, res) {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('owner', 'username')
      .populate('currentBook');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ group: group.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
}

export async function createGroup(req, res) {
  try {
    const { name, description, googleId } = req.body;
    if (!name || !googleId) {
      return res.status(400).json({ error: 'name and googleId are required' });
    }
    const book = await findOrCreateLocalBook(googleId);
    const group = await Group.create({
      name,
      description,
      owner: req.user.id,
      currentBook: book._id,
    });
    await GroupMembership.create({ group: group._id, member: req.user.id });
    res.status(201).json({ group: group.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
}

export async function joinGroup(req, res) {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    const membership = await GroupMembership.findOneAndUpdate(
      { group: groupId, member: req.user.id },
      {},
      { new: true, upsert: true }
    );
    res.status(201).json({ membership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join group' });
  }
}

export async function leaveGroup(req, res) {
  try {
    const { groupId } = req.params;
    await GroupMembership.deleteOne({ group: groupId, member: req.user.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave group' });
  }
}

export async function listMembers(req, res) {
  try {
    const { groupId } = req.params;
    const members = await GroupMembership.find({ group: groupId })
      .populate('member', 'username');
    res.json({ members: members.map((m) => m.member) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
}
