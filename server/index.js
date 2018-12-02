const express = require('express')
const morgan = require('morgan');
const http = require('http');
const mongoose = require('mongoose');
const expressGraphQL = require('express-graphql');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

require('./services/auth');

const schema = require('./schema');

const { User, Conversation, Text } = require('./models');

const MONGO_URI = 'mongodb://nphung:password1@ds049558.mlab.com:49558/messenger';
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance'))
  .on('error', err => console.log('Error connecting to MongoLab:', err));


const app = express();

app.use(cors());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'vietnam',
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));
app.use(morgan('combined'));

const server = http.createServer(app);
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Server listening on port ' + port);
});
