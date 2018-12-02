const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLSchema
} = require('graphql');

const { User, Text, Conversation } = require('./models');
const AuthService = require('./services/auth');

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
        id: { type: new GraphQLNonNull(GraphQLID) },
        otherId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { id, otherId }) {
        return User.createChat(id, otherId);
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
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, args, req) {
        const { email, name, password } = args;

        return AuthService.signup({ email, password, name, req });
      }
    },
    signin: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, args, req) {
        const { email, password } = args;
        return AuthService.signin({ email, password, req });
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