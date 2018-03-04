//Including Mongoose model...
var mongoose = require('mongoose');
//creating object 
var Schema = mongoose.Schema;

var TestSchema = new Schema({
      testName: {type: String, required: true},
      testCategory: {type: String, required: true},
      totalScore: {type: Number,default: 5,required: true},
      totalQuestion: {type: Number,default:5},
      testDetails: {type: String},
      testDuration: {type: Number,default: 300},
      questions: []

}, { usePushEach: true });

 module.exports = mongoose.model('TestDetails', TestSchema); 

