const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model'); // Asegúrate de importar el modelo de usuario adecuado

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Usuario incorrecto.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Contraseña incorrecta.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};