const router = require('express').Router();
const passport = require('passport');
/*Guardamos los datos*/
const Usuario = require('../models/usuarios');
const Asignatura = require('../models/asignaturas');

/* vamos al modelo de usuarios */
router.get('/usuarios', async (req, res, next) => {
  /**Guardamos en una varibale lo que encontramos en usuarios */
  const usuarios = await Usuario.find();
  const asignaturas = await Asignatura.find();

  /*Imprimimos por consola para ver que los datos existen */
  console.log(usuarios);
  /*Devolvemos los datos a las vistas */
  res.render('usuarios', {
    usuarios, asignaturas
  });
});

router.post('/usuarios/add',passport.authenticate('local-signup', {
 
  successRedirect: '/usuarios',
  failureRedirect: '/usuarios',
  failureFlash: true,


}));

router.get('/usuarios/delete/:id',async (req, res, next) => {
  let { id } = req.params;
  await Usuario.remove({_id: id});
  res.redirect('/usuarios');
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
