const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  texts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Text' }]
});

schema.statics.findUsers = function(id) {
  return this.findById(id)
    .populate('users')
    .then(res => res.users);
}

schema.statics.findTexts = function(id) {
  return this.findById(id)
    .populate('texts')
    .then(res => res.texts);
}

module.exports = mongoose.model('Conversation', schema);