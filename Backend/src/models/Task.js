const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  column: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo', required: true },
  tag: { type: String, enum: ['general', 'research', 'design', 'backend', 'frontend', 'devops', 'meeting', 'people'], default: 'general', required: true },
  description: { type: String, default: 'Add description here' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true, collection: 'tasks' });

taskSchema.virtual('id').get(function () { return this._id.toString(); });
taskSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_, ret) => { delete ret._id; delete ret.userId; return ret; } });

taskSchema.index({ userId: 1, column: 1 });

module.exports = mongoose.model('Task', taskSchema);
