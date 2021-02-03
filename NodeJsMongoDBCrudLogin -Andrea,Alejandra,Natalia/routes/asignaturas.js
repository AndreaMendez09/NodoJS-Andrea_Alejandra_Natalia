const express = require('express');
const asignaturas = require('../models/asignaturas');
const router = express.Router();
//conectamos del fichero csv
const fs = require('fs'); // filesystem
const csv = require('csv-parser');// Encargado de parsear
const result=[];
/*Aca guardamos los datos*/ 
const Asignatura = require('../models/asignaturas');
const User = require('../models/usuarios');

//Email
//Requerimos el paquete
var nodemailer = require('nodemailer');

//creamos el objeto de tranporte
var transporter = nodemailer.createTransport({

  host:'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user:"proyectonode3@gmail.com",
    pass: "proyecto123"

  }

})

//leermos el fichero csv
const readCsvFile = async (fileName) => {
    await fs.createReadStream(fileName)
      .pipe(csv({ separator: "," }))
      .on("data", (data) => result.push(data))
      .on("end", () => {
     
          result.map(asig=>{
            var asignaturas = new Asignatura
            asignaturas.title = asig.title;
            asignaturas.desciption = asig.desciption;
            asignaturas.info_instalacion = asig.info_instalacion;
            asignaturas.tipo_asignatura = asig.tipo_asignatura;
            asignaturas.save();
          });   
    })
};

//añadimos asignaturas al fichero csv
router.post('/addAsignaturaCSV', (req, res) => {
    var fileAsig=req.files.file;
    cont=0;
    console.log(fileAsig.mimetype);
    fileAsig.mv(`./files/asignaturas/${fileAsig.name}`,err=>{
      if(err) return res.status(500).send({message:err});
      readCsvFile(`./files/asignaturas/${fileAsig.name}`);
      res.redirect("/asignaturas");
    });
}) ;


/* vamos al modelo de asignaturas */
router.get('/asignaturas',isAuthenticated, async (req, res, next) => {
  /**Guardamos en una varibale lo que encontramos en Asignaturas */
  const asignaturas = await Asignatura.find();
  /*Imprimimos por consola para ver que los datos existen */
  console.log(asignaturas);
  /*Devolvemos los datos a las vistas */
  res.render('asignaturas', {
    asignaturas
  });
});

router.post('/asignaturas/add', isAuthenticated,async (req, res, next) => {
  console.log(req.body);
  /* Creamos un objeto de tipo asignaturas con el form*/ 
  const asignatura = new asignaturas(req.body);
  console.log(asignatura);
  /*Guardamos el usuario */
  await asignatura.save();
  /*Devolvemos los datos a la vista*/
  res.redirect('/asignaturas');
});

router.get('/asignaturas/delete/:id',isAuthenticated,async (req, res, next) => {
  let { id } = req.params;
  const asignatura = await Asignatura.findById(id);
  const users = await User.find();

var emails=[];
  var mensaje = "Asginatura Eliminado";
  for(var i=0; i < users.length; i++) { 
    for (var j=0; j < users[i].asignaturas.length;j++){
      if(asignatura._id.toString()==users[i].asignaturas[j].toString()){
        emails.push(users[i].correo);
        console.log(emails);
      }
    }
  }

  
var mailOption = {
  from:'proyectonode3@gmail.com',
  to: emails,
  subject: 'Asignatura eliminada'+ asignatura.title,
  text: "Buenos dias, sentimos informar que su asignatura fue eliminada de su plan de estudios"

};
  transporter.sendMail(mailOption,function(error,info){

    if(error){
      console.log(error);
  
    }else{
      console.log('Email Enviado: '+ info.response);
    }
  });
// guardar en una variableel email del usuario
await Asignatura.remove({_id: id});
res.redirect('/asignaturas');

  });



router.get('/asignaturas/editar_asignaturas/:id',isAuthenticated, async (req, res, next) => {
  const asignaturas = await Asignatura.findById(req.params.id);
  console.log(asignaturas);
  res.render('editar_asignaturas', { asignaturas });
});

//Debemos enviar un correo a los usuarios cuando se edite una asignatura en la que esten
router.post('/asignaturas/editar_asignaturas/:id', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const asignatura = await Asignatura.findById(id);
  const users = await User.find();

var emails=[];
  var mensaje = "Asginatura Eliminado";
  for(var i=0; i < users.length; i++) { 
    for (var j=0; j < users[i].asignaturas.length;j++){
      if(asignatura._id.toString()==users[i].asignaturas[j].toString()){
        emails.push(users[i].correo);
        console.log(emails);
      }
    }
  }

  
var mailOption = {
  from:'proyectonode3@gmail.com',
  to: emails,
  subject: 'La asignatura de '+ asignatura.title + "ha sido modificada",
  text: "Buenos dias, le informamos para que compruebe los cambios realizados en dicha asignatura"

};
  transporter.sendMail(mailOption,function(error,info){

    if(error){
      console.log(error);
  
    }else{
      console.log('Email Enviado: '+ info.response);
    }
  });


  await Asignatura.update({_id: id}, req.body);
  res.redirect('/asignaturas');
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
module.exports = router;
