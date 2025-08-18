import mongoose from 'mongoose';

const GroupMembershipSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

GroupMembershipSchema.index({ group: 1, member: 1 }, { unique: true });

export default mongoose.model('GroupMembership', GroupMembershipSchema);
