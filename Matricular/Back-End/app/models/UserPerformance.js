var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPerformanceSchema = new Schema({

        user: {
         type: String,
         required:true
        },
        testId: {
          type: String,
          required:true},
        testName:{
          type: String, 
          require:true},
        score: {
          type: Number,
          default: 0
        }, timeTaken: {
          type: Number,
          default: 0
        },totalCorrectAnswers: {
          type: Number,
          default: 0
        },totalWrongAnswers: {
          type: Number,
          default: 0
        },
        testTakenDateTime:{type: Date, default: Date.now}

})
module.exports = mongoose.model('UserPerformance', UserPerformanceSchema)

