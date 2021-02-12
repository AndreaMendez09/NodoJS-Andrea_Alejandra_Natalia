const express = require('express');
const router = express.Router();
/*Aca guardamos los datos*/ 
const Asignatura = require('../models/asignaturas');
const Software = require('../models/software');
const fs = require('fs'); 

router.post('/software/archivo/:id', isAuthenticated, async(req,res) =>{
  console.log("ewrt");



  var software = new Software();
  
  software.description=req.body.description;
  software.asignatura=req.params.id;
  software.url=req.body.url;
  var nombreNuevo;
  let  EDFile;
  if(req.files.archivo!=null){
   EDFile = req.files.archivo;

     nombreNuevo=(Math.floor((Math.random()*9999)+1))+`${EDFile.name}`;
     software.archivo=nombreNuevo;

  }

  await software.save();

  software = await Software.find({asignatura:req.params.id});
  const asignatura = await Asignatura.findById(req.params.id);

  if(req.files.archivo!=null){


 
  console.log(nombreNuevo);


  fs.rename(`${EDFile.name}`,nombreNuevo, () => { 
    console.log("\nFile Renamed!\n"); 
  }); 
  /*fs.readdirSync('./files/').forEach(file => { 
    console.log(file); 

  });*/ 
  
  EDFile.mv(`./files/${nombreNuevo}`,err =>{
    if(err) return res.status(500).send({ message : err})
   })
  }else{
  }
 
  res.redirect('/software/' + req.params.id)

});

router.get('/archivos/:id',isAuthenticated, async (req, res) => {
  res.download('./files/' + req.params.id);
})



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

router.get('/software/delete/:idAsignatura/:id',isAuthenticated,async (req, res, next) => {
  let { id } = req.params;

  await Software.remove({_id: id});
  software = await Software.find({asignatura:req.params.idAsignatura});
  const asignatura = await Asignatura.findById(req.params.idAsignatura);
  res.render('software', { 
    software,asignatura
  });
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}



module.exports = router;
