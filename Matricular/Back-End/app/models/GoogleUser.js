//Including Mongoose model...
var mongoose = require('mongoose');
//creating object 
var Schema = mongoose.Schema;

//Schema for user
var GoogleUserSchema = new Schema({

	id               : {type: String },
    name             : {type: String, required: true },
    email            : {type: String, required: true }
});

    

//model for userschema
module.exports = mongoose.model('GoogleUser' , GoogleUserSchema);
