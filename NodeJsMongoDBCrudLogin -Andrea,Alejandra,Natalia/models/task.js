const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
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
    default: false
  },
  usuario: [
    {type: mongoose.Schema.Types.ObjectId, ref:'user'}
]
});

module.exports = mongoose.model('tasks', TaskSchema);
