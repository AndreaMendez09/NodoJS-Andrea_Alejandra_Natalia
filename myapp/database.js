const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Usuario@cluster0.s5axn.mongodb.net/test', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('db connect'))
    .catch(err => console.log(err))