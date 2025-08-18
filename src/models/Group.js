import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    currentBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    periodStart: { type: Date, default: Date.now },
    periodEnd: { type: Date },
  },
  { timestamps: true }
);

GroupSchema.index({ owner: 1, name: 1 }, { unique: true });

GroupSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    owner: this.owner,
    currentBook: this.currentBook,
    periodStart: this.periodStart,
    periodEnd: this.periodEnd,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('Group', GroupSchema);
