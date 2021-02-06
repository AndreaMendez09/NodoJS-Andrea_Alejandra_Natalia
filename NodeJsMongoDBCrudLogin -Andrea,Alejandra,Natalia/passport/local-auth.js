const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/usuarios');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, correo, password, done) => {
  const user = await User.findOne({'correo': correo})
  if(user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.correo = correo;
    newUser.nombre = req.body.nombre;
    newUser.apellidos = req.body.apellidos;
    newUser.rol = req.body.rol;
    newUser.asignaturas = req.body.asignaturas;
    newUser.tipo_curso = req.body.tipo_curso;
    newUser.password = newUser.encryptPassword(password);
    await newUser.save();
    done(null, req.user);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, correo, password, done) => {
  const user = await User.findOne({correo: correo});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));
