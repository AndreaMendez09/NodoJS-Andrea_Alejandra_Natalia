const express = require('express');
const asignaturas = require('../models/asignaturas');
const router = express.Router();
/*Aca guardamos los datos*/ 
const Asignatura = require('../models/asignaturas');

/* vamos al modelo de asignaturas */
router.get('/asignaturas', async (req, res, next) => {
  /**Guardamos en una varibale lo que encontramos en Asignaturas */
  const asignaturas = await Asignatura.find();
  /*Imprimimos por consola para ver que los datos existen */
  console.log(asignaturas);
  /*Devolvemos los datos a las vistas */
  res.render('asignaturas', {
    asignaturas
  });
});

router.post('/asignaturas/add',async (req, res, next) => {
  console.log(req.body);
  /* Creamos un objeto de tipo asignaturas con el form*/ 
  const asignatura = new asignaturas(req.body);
  console.log(asignatura);
  /*Guardamos el usuario */
  await asignatura.save();
  /*Devolvemos los datos a la vista*/
  res.redirect('/asignaturas');
});

router.get('/asignaturas/delete/:id',async (req, res, next) => {
  let { id } = req.params;
  await Asignatura.remove({_id: id});
  res.redirect('/asignaturas');
});

router.get('/asignaturas/editar_asignaturas/:id', async (req, res, next) => {
  const asignaturas = await Asignatura.findById(req.params.id);
  console.log(asignaturas);
  res.render('editar_asignaturas', { asignaturas });
});

router.post('/asignaturas/editar_asignaturas/:id', async (req, res, next) => {
  const { id } = req.params;
  await Asignatura.update({_id: id}, req.body);
  res.redirect('/asignaturas');
});

router.get('/tasks/turn/:id',isAuthenticated, async (req, res, next) => {
  let { id } = req.params;
  const task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect('/tasks');
});


router.get('/tasks/edit/:id', isAuthenticated, async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  console.log(task);
  res.render('edit', { task });
});

router.post('/tasks/edit/:id',isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/tasks');
});

router.get('/tasks/delete/:id', isAuthenticated,async (req, res, next) => {
  let { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/tasks');
});

router.get('/tasks/search',isAuthenticated, async (req, res, next) => {
  let search = req.query.search;
  console.log(search);
  const tasks = await Task.find({'title' : new RegExp(search, 'i'),'usuario': req.user._id});
  res.render('tasks', {
    tasks
  });
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
module.exports = router;
