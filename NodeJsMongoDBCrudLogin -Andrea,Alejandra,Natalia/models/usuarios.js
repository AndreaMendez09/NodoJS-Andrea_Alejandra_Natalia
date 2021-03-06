const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = new Schema({
  correo:  { 
    type: String, 
    required: true 
  },
  password:  { 
    type: String, 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  apellidos: { 
    type: String, 
    required: true 
  },
  imagen_perfil: {
    type: String, 
  },
  asignaturas: { 
    type: Array
  },
  rol: { 
    type: String, 
    required: true 
  }
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('usuarios', userSchema);
