const router = require('express').Router();
const passport = require('passport');
/*Guardamos los datos*/
const Usuario = require('../models/user');

/* vamos al modelo de usuarios */
router.get('/user', async (req, res, next) => {
  /**Guardamos en una varibale lo que encontramos en usuarios */
  const usuario = await Usuario.find();
  /*Imprimimos por consola para ver que los datos existen */
  console.log(usuario);
  /*Devolvemos los datos a las vistas */
  res.render('user', {
    usuario
  });
});

router.post('/usuarios/add',async (req, res, next) => {
  console.log(req.body);
  /* Creamos un objeto de tipo asignaturas con el form*/ 
  const usuario = new Usuario(req.body);
  console.log(usuario);
  /*Guardamos el usuario */
  await usuario.save();
  /*Devolvemos los datos a la vista*/
  res.redirect('/user');
});

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
