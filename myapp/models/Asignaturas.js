const mongoose = require('mongoose');
const { Schema } = mongoose;

const AsignaturaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    info_instalacion: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Asignatura', AsignaturaSchema);