var mongoose = require('mongoose')
var Schema  =  mongoose.Schema;

var userTestSchema = new Schema({

user: { type: String, require:true},
test: {type: String, require:true},
testName:{type: String, require:true},
question: {type: String, require:true},
userAnswer: {type: String, require:true},
correctAnswer: { type: String, require:true},
timeTakenEach: {type: Number,default: 1}  //stored in secs

})

module.exports = mongoose.model('UserTestDetails', userTestSchema);

