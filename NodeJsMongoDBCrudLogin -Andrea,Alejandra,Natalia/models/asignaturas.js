const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AsignaturaSchema = Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  info_instalacion: {
    type: String,
    required: true,
    default: "buenas",
  },
});

module.exports = mongoose.model('asignaturas', AsignaturaSchema);
