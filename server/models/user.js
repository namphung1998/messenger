const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const Conversation = require('./conversation');
const Text = require('./text');

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

schema.statics.createChat = function(id, otherId) {
  return Promise.all([this.findById(id), this.findById(otherId)])
    .then(([me, other]) => {
      const chat = new Conversation({ users: [me, other]});
      me.chats.push(chat);
      other.chats.push(chat);

      return Promise.all([chat.save(), me.save(), other.save()])
        .then(([chat, me, other]) => chat);
    });
};

schema.statics.sendMessage = function(id, chatId, content) {
  return this.findById(id).then(sender => {
    // if (!sender.chats.includes(chatId)) throw new Error("Can't send a message to a stranger!");


    // if (!idArr.includes(chatId)) throw new Error("Can't send a message to a stranger");

    return Conversation.findById(chatId)
      .then(chat => {
        const text = new Text({ sender, content });
        chat.texts.push(text);

        return Promise.all([chat.save(), text.save()])
          .then(([chat, text]) => text);
      })
  })
}


module.exports = mongoose.model('User', schema);