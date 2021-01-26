const router = require('express').Router();
const passport = require('passport');
/*Guardamos los datos*/
const Usuario = require('../models/usuarios');

/* vamos al modelo de usuarios */
router.get('/usuarios', async (req, res, next) => {
  /**Guardamos en una varibale lo que encontramos en usuarios */
  const usuarios = await Usuario.find();
  /*Imprimimos por consola para ver que los datos existen */
  console.log(usuarios);
  /*Devolvemos los datos a las vistas */
  res.render('usuarios', {
    usuarios
  });
});

router.post('/usuarios/add', passport.authenticate('local-signup', {
  /*console.log(req.body);
  // Creamos un objeto de tipo asignaturas con el form
  const usuario = new Usuario(req.body);
  console.log(usuario);
  //Guardamos el usuario 
  await usuario.save();
  //Devolvemos los datos a la vista
  res.redirect('/usuario');*/
  successRedirect: '/usuarios',
  failureRedirect: '/usuarios',
  failureFlash: true
}));

router.get('/', (req, res, next) => {
  console.log("hola User");

  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/login', (req, res, next) => {
  res.render('login');
});


router.get('/editar', (req, res, next) => {
  res.render('editar');
});

router.get('/usuarios', (req, res, next) => {
  res.render('usuarios');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;
