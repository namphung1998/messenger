const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLID
} = require('graphql');

const UserType = require('./user_type');
const User = require('../models/user');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { name, email, password }) {
        const user = new User({ name, password, email });
        return User.findOne({ email })
          .then(existingUser => {
            if (existingUser) throw new Error('Email in use');
            
            user.save();
            return user;
          });
      }
    },
  })
});

module.exports = mutation;