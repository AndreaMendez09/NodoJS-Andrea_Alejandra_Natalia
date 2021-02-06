const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoftwareSchema = Schema ({
    description: {
        type: String
    },
    url: {
        type: String
    },
    asignatura: [
    {
          type: mongoose.Schema.Types.ObjectId, 
          ref:'asignaturas'
    }],
    archivo: {
        type: String
    }
});

module.exports = mongoose.model('software', SoftwareSchema);
