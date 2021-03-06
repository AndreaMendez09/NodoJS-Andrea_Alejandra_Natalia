const router = require('express').Router();
const passport = require('passport');
/*Guardamos los datos*/
const Usuario = require('../models/usuarios');
const Asignatura = require('../models/asignaturas');

/* vamos al modelo de usuarios */
router.get('/usuarios', isAuthenticated,async (req, res, next) => {
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

router.get('/usuarios/delete/:id',isAuthenticated,async (req, res, next) => {
  let { id } = req.params;
  await Usuario.remove({_id: id});
  res.redirect('/usuarios');
});

router.get('/usuarios/editar_usuarios/:id',isAuthenticated, async (req, res, next) => {
  const asignaturas = await Asignatura.find();
  const usuario = await Usuario.findById(req.params.id);
  console.log(usuario);
  res.render('editar_usuarios', { usuario,asignaturas });
});


router.post('/usuarios/editar_usuarios/:id', isAuthenticated,async (req, res, next) => {
  const { id } = req.params;
  await Usuario.update({_id: id}, req.body);
  res.redirect('/usuarios');
});



router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup',isAuthenticated ,(req, res, next) => {
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

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/software', (req, res, next) => {
  res.render('software');
});

router.post('/', passport.authenticate('local-signin', {
  successRedirect: '/asignaturas',
  failureRedirect: '/',
  failureFlash: true
}));


router.get('/usuarios', (req, res, next) => {
  res.render('usuarios');
});

router.get('/info_usuarios',isAuthenticated,(req, res, next) => {
  res.render('info_usuarios');
});



router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));



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
