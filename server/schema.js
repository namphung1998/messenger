const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLSchema
} = require('graphql');
const jwt = require('jwt-simple');

const { User, Text, Conversation } = require('./models');
const AuthService = require('./services/auth');

const config = require('./config')

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

function confirmUser(token) {
  let decoded;

  try {
    decoded = jwt.decode(token, config.secret);
  } catch (err) {
    return Promise.resolve(false);
  }

  return User.findById(decoded.sub)
    .then(user => {
      if (!user) return false;
      return true;
    })
}

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    chats: { 
      type: new GraphQLList(ConversationType),
      resolve(parentValue) {
        return User.findById(parentValue.id)
          .populate('chats')
          .then(res => res.chats);
      }
    }
  })
});

const ConversationType = new GraphQLObjectType({
  name: 'ConversationType',
  fields: () => ({
    id: { type: GraphQLID },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return Conversation.findById(parentValue.id)
          .populate('users')
          .then(res => res.users);
      }
    },
    texts: {
      type: new GraphQLList(TextType),
      resolve(parentValue) {
        return Conversation.findById(parentValue.id)
          .populate('texts')
          .then(res => res.texts);
      }
    }
  })
});

const TextType = new GraphQLObjectType({
  name: 'TextType',
  fields: () => ({
    id: { type: GraphQLID },
    sender: { 
      type: UserType,
      resolve(parentValue) {
        return Text.findById(parentValue.id)
          .populate('sender')
          .then(res => res.sender);
      }
    },
    content: { type: GraphQLString }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    me: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args, req) {
        return User.find({});
      }
    },
    texts: {
      type: new GraphQLList(TextType),
      resolve() {
        return Text.find({});
      }
    }
  })
});

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: () => ({
    createChat: {
      type: ConversationType,
      args: {
        token: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLID) },
        otherId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { token, id, otherId }) {
        if (!token) throw new Error('Not authenticated');

        return confirmUser(token).then(val => {
          if (!val) throw new Error('Not authenticated')

          return User.createChat(id, otherId);
        });
      }
    },
    sendMessage: {
      type: TextType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        chatId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { user_id, chatId, content }) {
        return User.sendMessage(user_id, chatId, content);
      }
    },
    signup: {
      type: GraphQLString,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, args, req) {
        const { email, name, password } = args;

        // console.log(typeof(AuthService.signup({ email, password, name, req })));

        return AuthService.signup({ email, password, name, req })
          .then(user => tokenForUser(user));
      }
    },
    signin: {
      type: GraphQLString,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, args, req) {
        const { email, password } = args;
        return AuthService.signin({ email, password, req })
          .then(user => tokenForUser(user));
      }
    },
    signout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        console.log(req.user);
        req.logout();
        return user;
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation
});