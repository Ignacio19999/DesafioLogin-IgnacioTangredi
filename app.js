const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const sessionRouter = require('./src/routes/session.router');
const viewsRouter = require('./src/routes/views.router');

const app = express();

const hbs = exphbs.create({

});

// Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Passport
require('./src/config/passport-local.config')(passport);
require('./src/config/passport-github.config')(passport);

// Configuración de la sesión
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Inicio de Passport
app.use(passport.initialize());
app.use(passport.session());

//  Mongo
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/session', sessionRouter);
app.use('/views', viewsRouter);


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});