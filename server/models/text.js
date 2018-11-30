const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  content: String,
  timestamp: Date
});

schema.pre('save', function(next) {
  const text = this;
  text.timestamp = new Date();
  next();
});

schema.statics.findSender = function(id) {
  return this.findById(id)
    .populate('sender')
    .then(res => res.sender);
}

module.exports = mongoose.model('Text', schema);