const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Tag', tagSchema);