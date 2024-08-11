const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Add likes field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
