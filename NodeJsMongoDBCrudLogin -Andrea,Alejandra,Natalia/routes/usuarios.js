const router = require('express').Router();
const passport = require('passport');
//conectamos del fichero csv
const fs = require('fs'); // filesystem
const csv = require('csv-parser');// Encargado de parsear
const result=[];
/*Guardamos los datos*/
const Usuario = require('../models/usuarios');
const Asignatura = require('../models/asignaturas');

//leermos el fichero csv
const readCsvFile = async (fileName) => {
    await fs.createReadStream(fileName)
      .pipe(csv({ separator: "," }))
      .on("data", (data) => result.push(data))
      .on("end", () => {
     
          result.map(user=>{
            var usuarios = new Usuario
            usuarios.nombre = user.nombre;
            usuarios.apellidos = user.apellidos;
            usuarios.correo = user.correo;
            usuarios.password = usuarios.encryptPassword(user.password);
            usuarios.imagen_perfil = user.imagen_perfil;
            usuarios.rol = user.rol;
            usuarios.tipo_curso = user.tipo_curso;
            usuarios.save();
          });   
    })
};

//añadimos usuarios al fichero csv
router.post('/addUserCSV', (req, res) => {
    var fileUsers=req.files.file;
    cont=0;
    console.log(fileUsers.mimetype);
    fileUsers.mv(`./files/users/${fileUsers.name}`,err=>{//ruta predeterminada donde guarda el csv 
      if(err) return res.status(500).send({message:err});
      readCsvFile(`./files/users/${fileUsers.name}`); 
      res.redirect("/usuarios");
    });
}) ;

// vamos al modelo de usuarios 
router.get('/usuarios', isAuthenticated,async (req, res, next) => {
  //Guardamos en una varibale lo que encontramos en usuarios 
  const usuarios = await Usuario.find();
  const asignaturas = await Asignatura.find();

  //Imprimimos por consola para ver que los datos existen 
  console.log(usuarios);
  //Devolvemos los datos a las vistas 
  res.render('usuarios', {
    usuarios, asignaturas
  });
});

// vamos al modelo de usuarios 
router.get('/usuarios', isAuthenticated,async (req, res, next) => {
  //Guardamos en una varibale lo que encontramos en usuarios 
  const usuarios = await Usuario.find();
  const asignaturas = await Asignatura.find();

  //Imprimimos por consola para ver que los datos existen 
  console.log(usuarios);
  //Devolvemos los datos a las vistas 
  res.render('usuarios', {
    usuarios, asignaturas
  });
});

/* vamos al modelo de usuarios */
router.get('/usuarios', isAuthenticated,async (req, res, next) => {
  if(req.user.rol=="Administrador"){
    /**Guardamos en una varibale lo que encontramos en usuarios */
    const usuarios = await Usuario.find();
    const asignaturas = await Asignatura.find();

    /*Imprimimos por consola para ver que los datos existen */
    console.log(usuarios);
    /*Devolvemos los datos a las vistas */
    res.render('usuarios', {
      usuarios, asignaturas
    });
  }else{
    res.redirect('/info_usuarios');
  }
  
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

router.get('/correo_alertas', (req, res, next) => {
  res.render('correo_alertas');
});

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

});

router.post('/correo_alertas/enviar', isAuthenticated, async (req, res, next) => {
  var emails = [];
  var informacion = req.body; 
  const users = await Usuario.find({'rol':'Administrador'});
  for (var i = 0; i < users.length; i++) {
    emails.push(users[i].correo);  
  }

  var mailOption = {
    from: 'proyectonode3@gmail.com',
    to: 'andreisima01@hotmail.com',
    subject: informacion.title + " - " + informacion.tipo_peticion,
    text: informacion.cuerpo

  };
  transporter.sendMail(mailOption, function (error, info) {

    if (error) {
      console.log(error);

    } else {
      console.log('Email Enviado: ' + info.response);
    }

  });

  res.redirect('/correo_alertas');
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
