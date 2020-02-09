const mongoose = require('mongoose');
// verification token for user signup
const verificationTokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);