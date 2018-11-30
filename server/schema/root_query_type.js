const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;
const UserType = require('./user_type');
const ConversationType = require('./conversation_type');

const User = require('../models/user');
const Conversation = require('../models/conversation');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID }},
      resolve(parentValue, args) {
        return User.findById(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    chat: {
      type: ConversationType,
      args: { id: { type: GraphQLID }},
      resolve(parentValue, args) {
        return Conversation.findById(args.id);
      }
    }
  }
});

module.exports = RootQueryType;
