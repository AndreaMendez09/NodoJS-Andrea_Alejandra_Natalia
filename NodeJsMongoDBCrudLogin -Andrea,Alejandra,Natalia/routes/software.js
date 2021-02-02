const express = require('express');
const router = express.Router();
/*Aca guardamos los datos*/ 
const Asignatura = require('../models/asignaturas');
const Software = require('../models/software');



router.get('/software/:id', isAuthenticated, async (req, res, next) => {
  const software = await Software.find({asignatura:req.params.id});
  const asignatura = await Asignatura.findById(req.params.id);
  console.log(software);
  res.render('software', { 
    software,asignatura
  });
});


router.post('/software/add/:id',isAuthenticated,async (req, res, next) => {
  /* Creamos un objeto de tipo software con el form*/ 
  var software = new Software(req.body);
  software.asignatura=req.params.id;
  console.log(software);
  /*Guardamos el usuario */
  await software.save();
  /*Devolvemos los datos a la vista*/
   software = await Software.find({asignatura:req.params.id});
  const asignatura = await Asignatura.findById(req.params.id);

  res.render('software', { 
    software,asignatura
  });
});

router.get('/software/delete/:id',isAuthenticated,async (req, res, next) => {

  let { id } = req.params;
  await Software.remove({_id: id});
  res.redirect('/software/add/:id');
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
module.exports = router;
