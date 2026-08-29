const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true, collection: 'users' });

userSchema.virtual('id').get(function () { return this._id.toString(); });
userSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_, ret) => { delete ret._id; delete ret.passwordHash; return ret; } });

module.exports = mongoose.model('User', userSchema);
