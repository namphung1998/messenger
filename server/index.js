const express = require('express')
const morgan = require('morgan');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const schema = require('./schema/schema');
const User = require('./models/user');
const Conversation = require('./models/conversation');
const Text = require('./models/text');

const MONGO_URI = 'mongodb://nphung:password1@ds049558.mlab.com:49558/messenger';
mongoose.connect(MONGO_URI);

// const user1 = User.findById('5bfcbd003ce7122cd98001a2').then(res => res);
// const user2 = User.findById('5bfcbcf83ce7122cd98001a1').then(res => res);
// Promise.all([user1, user2]).then(users => {
//   const chat = new Conversation({ users, texts: []});
//   users.forEach(user => {
//     user.chats.push(chat);
//     user.save();
//   })
//   chat.save();
// });


// User.findById('5bfcbd003ce7122cd98001a2')
//   .then(res => {
    
//     Conversation.findById('5bfdce7bc6c88c10ba9c190c')
//       .then(chat => {
//         const text = new Text({ content: 'Hello again', sender: res });
//         chat.texts.push(text);
//         chat.save();
//         text.save();
//       })
//   })


// Conversation.findById('5bfdce7bc6c88c10ba9c190c')
//   .populate('texts')
//   .then(res => {
//     const text = new Text({ content: 'Hello' });
//     res.texts.push(text);
//     res.save();
//     text.save();
//   })

Text.findSender('5bfdd117f581cc118f26a59f').then(res => console.log(res));




const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.get('/', (req, res) => {
  res.send('<h1>Hello!<h1>')
});

app.post('/users/create', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const user = new User({ name, email, password });

  user.save();
  res.end();
});

const server = http.createServer(app);
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Server listening on port ' + port);
});
