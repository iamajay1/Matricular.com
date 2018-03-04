myApp.controller('liveTestCtrl', ['$scope', '$filter', '$http', '$location', '$routeParams', 'testService', 'authService', function ($scope, $filter, $http, $location, $routeParams, testService, authService) {

    var main = this;
    main.userId = $routeParams.userId;
    main.test=$routeParams.testId;
    main.performanceUserID=main.userId;
    main.answerscorrect=0;
    main.answerswrong=0;
    main.securedscore=0;
    main.timeTaken=0;

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

    $('.testInstructions').modal('show');
   $('#userPerform').hide();
    $(document).on('click', function () {
        $('.testInstructions').modal('hide');
        $location.replace("#/takeTest/" + main.userId)
    })
	
	$(document).ready(function(){
	  $('#return').click(function(){
		window.location.href="/takeTest/"+main.userId;
		 setTimeout(function () { 
			location.reload();
			}, 10);
    });
});	

    // function to get the tests
    this.getSingleTest = function () {

        var singleTestId = $routeParams.testId;
        testService.getSingleTest(singleTestId)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                    window.location.href = "/takeTest/" + main.userId;
                } else {
                    if (response.data.data.questions.length !=5) {
                        alert("Sorry! Questions Are Not Equal To 5");
						$location.path("/takeTest/" + main.userId);
							 setTimeout(function () { 		
									location.reload();
								}, 10);
                    } else {
                        main.numberofQuestions = response.data.data.questions.length;
                        main.quizHeading = "Quiz on " + response.data.data.testName;
                        main.singletestArray = response.data.data.questions;
                        main.time = response.data.data.testDuration;
                        main.testName=response.data.data.testName;
                    }
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");

            })
    }
    this.getSingleTest();


    var total_seconds = 300;
    var c_minutes = parseInt(total_seconds / 60);
    var c_seconds = parseInt(total_seconds % 60);
    var time=0;
    //function to check time
    this.checkTime = function () {
      
        total_seconds = total_seconds - 1;
        c_minutes = parseInt(total_seconds / 60);
        c_seconds = parseInt(total_seconds % 60);
        main.timetakenfortest = (300 - total_seconds);

        time=time+1;
        authService.setUserData('totaltime',time);
        document.getElementById('quiz-time-left').innerHTML = 'Time Left: ' + c_minutes + ' minutes ' + c_seconds + ' seconds';
        if (total_seconds <= 0) {
            clearInterval(main.counttime);
            alert("Times Up!...");

            var score=authService.getUserData('totalscore');
            var data = {
                userid: $routeParams.userId,
                testid: $routeParams.testId,
                testName:main.testName,
                score: score,
                timeTaken: main.time,
                totalCorrectAnswers: score,
                totalWrongAnswers: 5 - score
            }
            testService.submitTest(data)
                .then(function successCallBack(response) {

                    if (response.data.error === true) {
                        alert(response.data.message);
                    } else {
                         var tscore=authService.getUserData('totalscore');
                           var timeintotal=authService.getUserData('totaltime');
                        main.performanceUserID = main.performanceUserID;
                        main.answerscorrect = tscore;
                        main.answerswrong = 5  - tscore;
                        main.securedscore = tscore;
                        main.timeTaken = timeintotal;
                       $('#userPerform').show();
                      $('#quizContainer').hide(); 

                        authService.removeUserData('totaltime');
                        authService.removeUserData('totalscore');
                    }
                }, function errorCallBack(response) {
                    alert("Error!! Check console");

                })

        }
    }

    //code related to getting question
    var currentQuestion = 0;
    var score = 0;
    var totQuestion = 0;
    var container = document.getElementById('quizContainer');
    var questionEl = document.getElementById('question');
    var opt1 = document.getElementById('opt1');
    var opt2 = document.getElementById('opt2');
    var opt3 = document.getElementById('opt3');
    var opt4 = document.getElementById('opt4');
    var nextButton = document.getElementById('nextButton');
    var resultCont = document.getElementById('result');
   //function to load next question
    this.loadQuestion = function (questionIndex) {
        if (questionIndex == 0) {
            totQuestion = main.numberofQuestions;

            $('.testInstructions').modal('hide');
            main.counttime = setInterval(this.checkTime, 1000);
        }
        var q = main.singletestArray[questionIndex];
        questionEl.textContent = (questionIndex + 1) + '.' + q.question+'?';
        opt1.textContent = q.optionA;
        opt2.textContent = q.optionB;
        opt3.textContent = q.optionC;
        opt4.textContent = q.optionD;
    };

    this.loadNextQuestion = function () {
        var selectedOption = document.querySelector('input[type=radio]:checked');
        if (!selectedOption) {
            alert("please select your answer!");
            return;
        }
        var answer = selectedOption.value;
        if (main.singletestArray[currentQuestion].answer == answer) {
            score += 1;
        }
        authService.setUserData('totalscore',score);
        var data = {
            userid: $routeParams.userId,
            testid: $routeParams.testId,
            testName:main.testName,
            questionid: main.singletestArray[currentQuestion].quesID,
            userAnswer: answer,
            correctAnswer: main.singletestArray[currentQuestion].answer,
            timeTakenEach: 1
        }
        testService.submitUserTestAnswer(data)
            .then(function successCallBack(response) {}, function errorCallBack(response) {})
        selectedOption.checked = false;
        currentQuestion++;
        if (currentQuestion == main.numberofQuestions - 1) {
            nextButton.textContent = 'finish';
        }
        if (currentQuestion == main.numberofQuestions) {
            clearInterval(main.counttime);
            var tottime=authService.getUserData('totaltime');
            //code to submit data...
            var data = {
                userid: main.userId,
                testid: $routeParams.testId,
                testName:main.testName,
                score: score,
                timeTaken: tottime,
                totalCorrectAnswers: score,
                totalWrongAnswers: 5 - score
            }

           
            //console.log(data);
            testService.submitTest(data)
                .then(function successCallBack(response) {

                    if (response.data.error === true) {
                        alert(response.data.message);
                    } else {
                        main.performanceUserID = main.performanceUserID;
                        main.answerscorrect = response.data.data.totalCorrectAnswers;
                        main.answerswrong = response.data.data.totalWrongAnswers;
                        main.securedscore = response.data.data.score;
                        main.timeTaken = response.data.data.timeTaken;
                        $('#userPerform').show();
                        $('#quizContainer').hide(); 
                         authService.removeUserData('totaltime');
                         authService.removeUserData('totalscore');

                    }
                }, function errorCallBack(response) {
                    //console.log(response);
                    alert("Error!! Check console");

                })
            return;
        }
        this.loadQuestion(currentQuestion);
    }


}]);
