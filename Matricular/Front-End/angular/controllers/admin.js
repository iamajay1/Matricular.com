myApp.controller('adminCtrl', ['$filter', '$http', '$location', '$routeParams','$route', 'testService', 'authService', function ($filter, $http, $location, $routeParams,$route, testService, authService) {

    var main = this;
    var user;
		this.logged = function () {
         main.username = authService.getUserData('Uname');
        main.login=authService.getUserData('logged'); 
        if (main.login=="1") {
            return 1;
        } else {
            return 0;
        }
		}

    this.logged();
    
	this.userId = $routeParams.userId;
	this.logout = function () {
        authService.setToken();
        authService.removeUserData('Uname');
        authService.removeUserData('logged');
        $location.path('/');
    }

	 
        main.singleTestId = $routeParams.testId;
        main.singleTestName = $routeParams.testName;
         main.userId = $routeParams.userId;
    main.createATest = function () {

        var data = {
            testName: main.testName,
            testCategory: main.testCategory,
            testDetails: main.testDetails,
			totalQuestion: main.totalQuestion,
            totalScore: main.totalScore,
            testDuration: main.testDuration
        }
        testService.createATest(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    
                    $('.form-control').val('');
                    main.getTests();
                    alert("Test has been Created Successfully!");
                }
            }, function errorCallBack(response) {
                alert("Error!! Check console");

            })
    }

	$(document).ready(function(){
	  $('#submittest').click(function(){
		window.location.href="/admindashboard/"+main.userId;
		 setTimeout(function () { 
			location.reload();
			}, 10);
    });
});	
    var testId;

    //creating function to get the tests
    main.getTests = function () {

        testService.getTests()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.testArray = response.data.data;

                    main.userID=$routeParams.userId;
                    console.log(main.userID)
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");

            });
    }

   // function to get the tests
    main.getSingleTest = function (id) {
        var data = id;
        //alert(id);
        testService.getSingleTest(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.singleTestArray=response.data.data;

            main.testName=main.singleTestArray.testName;
            main.testCategory=main.singleTestArray.testCategory
            main.testDetails=main.singleTestArray.testDetails;
			main.totalQuestion = main.singleTestArray.totalQuestion;
            main.totalScore=main.singleTestArray.totalScore;
            main.testDuration=main.singleTestArray.testDuration;
            main.testId=main.singleTestArray._id;
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");

            });
            
    }
	   

//function to update a test
       main.getSingleTestDetUpdate = function (id) {
        var data = id;
        //alert(id);
        testService.getSingleTest(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.singleTestArray=response.data.data;
                     
                    main.testName=main.singleTestArray.testName;
            main.testCategory=main.singleTestArray.testCategory
            main.testDetails=main.singleTestArray.testDetails;
			main.totalQuestion= main.singleTestArray.totalQuestion;
            main.totalScore=main.singleTestArray.totalScore;
            main.testDuration=main.singleTestArray.testDuration;
            main.testId=main.singleTestArray._id;
            
         $('#updateTest').show();
         $('#dashAdmin').hide();
          $('#updateATest').show();
          $('#createATest').hide();
          $('#testName').attr("disabled", "disabled"); 
         
                  //console.log(main.singleTestArray);
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");

            });


            
    }
    //function to update a tests

    main.updateATest = function () {

        var data = {
            testName: main.testName,
            testCategory: main.testCategory,
            testDetails: main.testDetails,
			totalQuestion: main.totalQuestion,
            totalScore: main.totalScore,
            testDuration: main.testDuration,
            id: main.testId
        }
        //console.log(data);
        testService.updateATest(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    $('.form-control').val('');

                    alert("Test has been Updated Successfully...");
                    
                    main.getTests();
                    $route.reload();
                     $location.path('/admindashboard/'+main.userId);


                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");

            })
    }

    //function to delete a test

    main.deleteATest = function (id) {

        var data = id;
        //console.log(id);
        testService.deleteATest(data)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                   // console.log(response);
                    main.getTests();
                    alert("Test has been Deleted Successfully...");
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check Console");
            })

    }

    //function to view questions

  main.viewQuestions = function (id) {

        var data = id;
        testService.viewQuestions(data)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.quesArray = response.data.data;
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })

    }
    //function to create questions

    main.createQuestions = function () {

        var data = {
            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer: main.answer,
            id:main.singleTestId
        }
       // console.log(data);
        testService.createQuestions(data)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.viewQuestions(main.singleTestId);
                     $('.form-control').val('');
                    $location.path('/Admin/QuestionInfo/'+main.userId+'/'+main.singleTestId+'/'+main.singleTestName);
                    alert("Question has been Added Successfully!");
                   
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }

$(document).ready(function(){
	  $('#btnCreateQues').click(function(){
		alert("Please Note : You Can Add only 5 Questions In One Test! ")
		});
});	

    //function to delete a question

     main.deleteAQuestion = function (index, quesid) {
        var data = {
            id: main.singleTestId
        }

        testService.deleteAQuestion(data, index, quesid)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.viewQuestions(main.singleTestId);
                    $location.path('/Admin/QuestionInfo/'+main.userId+'/'+main.singleTestId+'/'+main.singleTestName);

                    alert("Question no: " + (index + 1) + " is Deleted!");
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }
//function to get a single question details

main.getSingleQuestionDet = function (index) {
        var data = {
            id: main.singleTestId
        }
      main.singleQuesIndex=index;
        testService.getSingleQuestionDet(data, index)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                     main.questionDet=response.data;
                    main.question= main.questionDet.question;
            main.optionA= main.questionDet.optionA;
            main.optionB= main.questionDet.optionB;
            main.optionC= main.questionDet.optionC;
            main.optionD= main.questionDet.optionD;
            main.answer=main.questionDet.answer;
            main.quesID=main.questionDet.quesID;
           $('#updateQuestion').show(); 
          $('#dashAdminQuestion').hide();   
             $('#createQuestion').hide();
              $('#btnBack').hide();
             $('#btnBackToTest').show();
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }

//function to update a question  

    main.updateAQuestion = function (index) {

        var data = {
            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer: main.answer,
            quesID:main.quesID
        }   
  
        testService.updateAQuestion(data,index,main.singleTestId)
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                     main.viewQuestions(main.singleTestId);

                    $location.path('/Admin/QuestionInfo/'+main.userId+'/'+main.singleTestId+'/'+main.singleTestName);
                    $('.form-control').val('');
                    
                    alert("Question Is Updated Successfully!");
                    $route.reload();
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check Console");
            })
    }


    ////////////////////////////////getuserinfo///////////////////

    main.getUserInfoforperformance = function () {

        testService.userInfo()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {

                    main.userInfo = response.data.data;
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })

    }
    /********************************************************/

//////////////////Get performance of all user start///////////////////////////////////////
     main.getUserPerformanceDet = function (userid) {
        var id = userid;
        testService.getusertestdetails(id)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userTestPerform = response.data.data;
                $('#pnlViewUserTestDet').show();
                $('#allUsers').hide();
                $('#allUserInfo').hide();
  
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }
/********************************************************************************************/

/////////////////////////////////////////////////////////

    main.getUserInfo = function () {
        testService.userInfo()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userInfo = response.data.data;
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }

    main.getUserInfofacebook = function () {
        testService.userInfofacebook()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userInfofacebook = response.data;
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }

    main.getUserInfogoogle = function () {
        testService.userInfogoogle()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userInfogoogle = response.data;
                }
            }, function errorCallBack(response) {
                alert("Error!! Check Console");
            })
    }
}])
