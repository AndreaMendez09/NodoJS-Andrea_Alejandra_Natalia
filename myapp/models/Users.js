const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    asignaturas: {
        type: Array,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('User', UserSchema);