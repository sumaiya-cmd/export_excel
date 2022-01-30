const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/app');

const userSchema = mongoose.Schema({
    name:String,
    mobile:Number,
    email:String
});

module.exports = mongoose.model('users',userSchema) ;