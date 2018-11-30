const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Conversation = require('./conversation');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'}]
});

schema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

schema.statics.findChats = function(id) {
  return this.findById(id)
    .populate('chats')
    .then(res => res.chats);
}

schema.methods.createChat = function(other, callback) {
  const chat = new Conversation({ texts: [] });

  chat.users.push(...[this, other]);
  this.chats.push(chat);
  other.chats.push(chat);

  chat.save();
  this.save();
  other.save();
}

module.exports = mongoose.model('User', schema);