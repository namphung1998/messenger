const {
  GraphQLObjectType, 
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const ConversationType = require('./conversation_type');

const User = require('../models/user');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    chats: {
      type: new GraphQLList(ConversationType),
      resolve(parentValue) {
        return User.findChats(parentValue.id);
      }
    }
  })
});

module.exports = UserType;