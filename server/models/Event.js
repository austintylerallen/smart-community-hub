const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String, // Ensure this is a string
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Event', eventSchema);
