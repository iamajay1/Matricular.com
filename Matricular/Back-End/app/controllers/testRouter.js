var mongoose = require('mongoose');
var express = require('express');
var testRoutes = express.Router();
var TestDetails = require('../models/TestDetails');
var Questions = require('../models/Questions');
var UserTestDetails = require('../models/UserTestDetails');
var UserPerformance = require('../models/UserPerformance');
//var Performance = require('../models/Performance');
//response generating Liberary
var resGenerator = require('../../libs/resGenerator');

//shortId to generate unique ticketNumber and to  ease the db accessing through unique id
var shortid = require('shortid');

//defining Auth as middleware for accessing api's
//defining token...
var token;
// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');
//defining decoded tokens...
var decodedToken;
var auth = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, "1993%^#QWERTY654321#90", function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                decodedToken = decoded;
                next();
            }
        });
    }
}

/*All Testing API'S*/

//all api's related to creation and deletion of tests....
/*********************************************************************************************************************/
//Api to create a new Test By Admin...

testRoutes.post('/admin/createTest', auth, function (req, res) {
    var testDetails = new TestDetails(req.body);
   // console.log(test);
    testDetails.save(function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "Test details inserted successfully", 200, test);
            res.send(response);
        }
    });
});
/********************************************************************************************************************/

//api to get all tests for user as well as Admin

testRoutes.get('/allTestDetails', auth, function (req, res) {

    TestDetails.find(function (err, tests) {
       // console.log(tests);
        if (err) {
            var error = resGenerator.generate(true, "Some error occured,, error : " + err, 500, null);
            res.send(error);
        } else if (tests === [] || tests === undefined || tests === null) {
            var error = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "All tests fetched successfully", 200, tests);
            res.send(response);
        }
    });
});
/*******************************************************************************************************************/

//API to display single test...
testRoutes.get('/test/:testid', auth, function (req, res) {

    TestDetails.findById({
        _id: req.params.testid
    }, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured,, error : " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            var error = resGenerator.generate(true, "No result found, Or test Deleted...", 204, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "Test fetched successfully", 200, test);
            res.send(response);
        }
    });
});
/*******************************************************************************************************************/

//api to update a test by Admin
testRoutes.put('/test/update/:test_id', auth, function (req, res) {
    TestDetails.findByIdAndUpdate({
        _id: req.params.test_id
    }, req.body, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "Successfully updated A Test", 200, test);
            res.send(response);
        }
    });
});
/*******************************************************************************************************************/

//api to delete a test by admin
testRoutes.delete('/test/delete/:test_id', auth, function (req, res) {

    TestDetails.findByIdAndRemove(req.params.test_id, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured, error : " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            var error = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "Test deleted successfully", 200, test);
            res.send(response);
        }
    });
});


/******************************************************************************************************************/

//API'S for creation of Question By Admin Panel...
testRoutes.post('/createQuestions/:test_id', auth, function (req, res) {
    TestDetails.findById({
        _id: req.params.test_id
    }, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured, Symbol from the Test ID error : " + err, 500, null);
            res.send(error);
        } else {
            if (test.questions.length == 5) {
                var error = resGenerator.generate(true, "Sorry! you can add only 5 Questions... " + err, 500, null);
                res.send(error);
            } else {
                var question={ question: req.body.question,
            optionA: req.body.optionA,
            optionB: req.body.optionB,
            optionC: req.body.optionC,
            optionD: req.body.optionD,
            answer: req.body.answer,
            quesID:shortid.generate()
        };
               // questions.save();
                test.questions.push(question);
                test.save(function (err, test) {
                    if (err) {
                        var error = resGenerator.generate(true, "Some error occured, error : " + err, 500, null);
                        res.send(error);
                    } else if (test.questions === null || test.questions === undefined || test.questions === []) {
                        var error = resGenerator.generate(true, "No result found , empty array", 204, null);
                        res.send(error);
                    } else {
                        var response = resGenerator.generate(false, "Question Created successfully", 200, test);
                        res.send(response);
                    }
                });
            }
        }
    });
});
/********************************************************************************************************************/

//to get all questions by User as well as Admin
testRoutes.get('/getquestions/:test_id', auth, function (req, res) {
    TestDetails.findById({
        _id: req.params.test_id
    }, function (err, test) {
        //console.log(test);
        if (err) {
            var error = resGenerator.generate(true, "Some error occured,, error : " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            var error = resGenerator.generate(true, "No Questions found , empty array", 204, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "All Questions fetched successfully", 200, test.questions);
            res.send(response);
        }
    })
});
/**********************************************************************************************************************/

//api to delete a question from questions as well as test model by Admin
testRoutes.get('/question/delete/:test_id/:index/:question_id', auth, function (req, res) {
    TestDetails.findOne({
        _id: req.params.test_id
    }, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured ,error " + err, 500, null);
            res.send(error);
        } else {
            if (test.questions.length == 0) {
                var error = resGenerator.generate(true, "Sorry! There are no Question for this test : " + err, 500, null);
                res.send(error);
            } else {
              //  Questions.findByIdAndRemove(req.params.question_id);
                test.questions.splice(req.params.index, 1);
               // console.log(test.questions);
                test.save(function (err, question) {
                    if (err) {
                        var error = resGenerator.generate(true, "Some error occured,error : " + err, 500, null);
                        res.send(error);
                    } else {
                        var response = resGenerator.generate(false, "Question has been deleted successfully!!!", 200, question);
                        res.send(response);
                    }
                });
            }
        }
    });
});
/***********************************************************************************************************************/

//api to get a question from test model by Admin
testRoutes.get('/question/getAQuesDet/:test_id/:index', auth, function (req, res) {
    TestDetails.findOne({
        _id: req.params.test_id
    }, function (err, test) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured ,error " + err, 500, null);
            res.send(error);
        } else {
            if (test.questions.length == 0) {
                var error = resGenerator.generate(true, "Sorry! There are no Question : " + err, 500, null);
                res.send(error);
            } else {
                res.send(test.questions[req.params.index]);
               var response = resGenerator.generate(false, "All Questions fetched successfully", 200, test.questions[req.params.index]);
            }
        }
    });
});
/***********************************************************************************************************************/

//api to update a question
testRoutes.post('/question/update/:test_id/:index', auth, function (req, res) {
            TestDetails.findOneAndUpdate({'questions.quesID':req.body.quesID},
             {'$set': {
         'questions.$.question':req.body.question,
        'questions.$.optionA':req.body.optionA,
            'questions.$.optionB':req.body.optionB,
            'questions.$.optionC':req.body.optionC,
            'questions.$.optionD':req.body.optionD,
            'questions.$.answer':req.body.answer         
    }}
                , function (err, test) {
            if (err) {
            var error = resGenerator.generate(true, "Some error occured, error : " + err, 500, null);
            res.send(error);
        } else {
             var response = resGenerator.generate(false, "Question Updated successfully!!!", 200, test);
             res.send(response);
          
            }

            })
        });
/************************************************************************************************************************/

//API'S to store the data of the User in the mongoDB.....


//api for performance
testRoutes.post('/userPerform/:test_id', auth, function (req, res) {
    //api to add test result in db with all details
    var UserPerfor = new UserPerformance(req.body);
    UserPerfor.user = decodedToken.id;
    UserPerfor.testId = req.params.test_id;
    UserPerfor.save(function (err, scorePerformance) {
        if (err) {
            var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "Successfully Stored totalPerformance", 200, scorePerformance);
            res.send(response);
        }
    });
});
/*********************************************************************************************************************/

//api to add scores to mongodb
testRoutes.post('/userTest/:test_id/questions/:question_id/answer', auth, function (req, res) {
    //api to add test result in db with all details
    var answerResult;
    var timeTakenEach;
    TestDetails.find({'questions.quesID':req.params.question_id}, function (err, question) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured, error : " + err, 500, null);
            res.send(error);
        } else {
            var userTestDetails = new UserTestDetails(req.body);
            userTestDetails.user = decodedToken.id;
            userTestDetails.question = req.params.question_id;
            userTestDetails.test = req.params.test_id;
        }
        userTestDetails.save(function (err, answer) {
            if (err) {
                var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
                res.send(error);
            } else {
                var response = resGenerator.generate(false, "Successfully Given A Test", 200, answer);
                res.send(response);
            }
        });
    });
});
/*********************************************************************************************************************/


//api to get the performance of specific user in specific test...

testRoutes.get('/performance/user/:user_id', auth, function (req, res) {
    //api to get  performance user specific
    UserPerformance.find({
        user: req.params.user_id
    }, function (err, Performance) {
        if (err) {
            var error = resGenerator.generate(true, "Some error occured, error : " + err, 500, null);
            res.send(error);
        } else if (Performance === [] || Performance === undefined || Performance === null) {
            var error = resGenerator.generaxte(true, "No result found , empty array", 204, null);
            res.send(error);
        } else {
            var response = resGenerator.generate(false, "TotalPerformance of user in all Tests fetched successfully!!!", 200, Performance);
            res.send(response);
        }
    });
});
/************************************************************************************************************************/

//export testRoutes
module.exports = testRoutes;
