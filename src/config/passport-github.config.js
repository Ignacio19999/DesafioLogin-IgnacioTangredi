const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user.model');

module.exports = function(passport) {
  passport.use(new GitHubStrategy({
    clientID: 'Iv1.ca7d293bc763668f',
    clientSecret:'cdd848963243043c5fef96573cab69675f0fdbbf',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ githubId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, user);
      } else {
        
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : null
        });
        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};