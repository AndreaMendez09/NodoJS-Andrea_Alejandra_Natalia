const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Usuario:1234@cluster0.s5axn.mongodb.net/Universidad?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('db connect'))
    .catch(err => console.log(err))