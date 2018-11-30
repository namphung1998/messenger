const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

const Text = require('../models/text');
const UserType = require('./user_type');

const TextType = new GraphQLObjectType({
  name: 'TextType',
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    sender: {
      type: UserType,
      resolve(parentValue) {
        return Text.findSender(parentValue.id);
      }
    }
  })
});

module.exports = TextType;

