const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jwt-simple');
const { User } = require('../models');

const config = require('../config');

const localOptions = { usernameField: 'email' };

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

passport.use(new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({ email: email.toLowerCase() }, function(err, user) {
    if (err) return done(err);

    if (!user) return done(null, false, 'Invalide credentials');

    user.comparePassword(password, function(err, same) {
      if (err) return done(err);
      if (!same) return done(null, false, 'Invalid credentials');

      return done(null, user);
    });
  });
}));

exports.signup = function({ email, password, name, req }) {
  if (!email || !password) throw new Error('You must provide an email and password!');

  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) throw new Error('Email in use!');

      const user = new User({ email, password, name });
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        req.login(user, err => {
          if (err) reject(err);

          resolve(user);
        });
      });
    });
}

exports.signin = function({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', function(err, user) {
      if (err) reject(err);

      if (!user) reject('Invalid credentials');

      req.login(user, function(err){
        if (err) reject(err);

        resolve(user);
      })
    })({ body: { email, password }});
  });
}