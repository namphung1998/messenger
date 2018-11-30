const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const UserType = require('./user_type');
const TextType = require('./text_type');

const Conversation = require('../models/conversation');

const ConversationType = new GraphQLObjectType({
  name: 'ConversationType',
  fields: () => ({
    id: { type: GraphQLID },
    texts: { 
      type: new GraphQLList(TextType),
      resolve(parentValue) {
        return Conversation.findTexts(parentValue.id);
      }
    }
  })
});

module.exports = ConversationType;