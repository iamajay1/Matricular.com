//Including Mongoose model...
var mongoose = require('mongoose');
//creating object 
var Schema = mongoose.Schema;

//Schema for user
var FbUserSchema = new Schema({

	id               : {type: String },
	email             :{type:String},
    name             : {type: String, required: true }
})
    

//model for userschema
module.exports = mongoose.model('FbUser',FbUserSchema);
