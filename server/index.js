const express = require('express')
const morgan = require('morgan');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const schema = require('./schema');

const { User, Conversation } = require('./models');

const MONGO_URI = 'mongodb://nphung:password1@ds049558.mlab.com:49558/messenger';
mongoose.connect(MONGO_URI);

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

app.get('/', (req, res) => {
  res.send('<h1>Hello!<h1>')
});

app.get('/users', (req, res) => {
  User.find({}, function(err, users) {
    if (err) throw err;
    
    return res.json(users);

  });
});

app.post('/users/create', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const user = new User({ name, email, password });

  user.save();
  res.redirect('/users');
});

const server = http.createServer(app);
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Server listening on port ' + port);
});
