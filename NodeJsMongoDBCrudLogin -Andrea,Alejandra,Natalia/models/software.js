const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoftwareSchema = Schema ({
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    asignatura: [
      {type: mongoose.Schema.Types.ObjectId, ref:'asignaturas'}
  ]
});

module.exports = mongoose.model('software', SoftwareSchema);
