const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: { type: String, required: true },
  tagId: { type: String },
  userId: { type: String, required: true },
  createdOn: { type: Date, required: true },
  updatedOn: { type: Date, required: true }
});

module.exports = mongoose.model('Note', noteSchema);