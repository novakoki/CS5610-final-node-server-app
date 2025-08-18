import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['READER', 'AUTHOR', 'MODERATOR', 'ADMIN'],
      default: 'READER',
      required: true,
    },
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
  },
  { timestamps: true }
);

UserSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    username: this.username,
    role: this.role,
    name: this.name,
    bio: this.bio,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', UserSchema);


