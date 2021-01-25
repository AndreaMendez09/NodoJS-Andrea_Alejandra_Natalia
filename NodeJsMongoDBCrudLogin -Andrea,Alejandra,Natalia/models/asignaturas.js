const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AsignaturasSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  info_instalacion: {
    type: String,
    default: false
  }
});

module.exports = mongoose.model('asignaturas', AsignaturasSchema);
