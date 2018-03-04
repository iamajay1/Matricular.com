myApp.controller('userDashCtrl', ['$filter', '$http','$window', '$location', '$routeParams', 'testService', 'authService', function ($filter, $http,$window,$location, $routeParams, testService, authService) {

    var main = this;
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
	
    //code to get the details or number of tests taken,pending test as average score:
    this.getusertestdetails = function () {
        var userid = $routeParams.userId;
        testService.getusertestdetails(userid)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {

                    var data = response.data.data;
                    //console.log(data);
                    main.testtakenDetails = data;
                    main.testtakenDetailsforgraph = [];
                    main.testtakenDetailslabels = [];
                    var len = data.length;
                    for(var i=0;i<data.length;i++)
                    {
                            main.testtakenDetailsforgraph.push(data[i].score);
                            main.testtakenDetailslabels.push(data[i].testName)
                    }
                    if (len == 0) {
                        main.testtaken = "No Tests Given";
                        main.averagemarks = "0";
                    } else {
                        var scoreadd = 0;
                        for (var i = 0; i < len; i++) {
                            scoreadd = scoreadd + data[i].score;
                        }
                        main.averagemark = (scoreadd / len);
                         main.testtaken = data.length;
                    }

                }
            }, function errorCallBack(response) {
                alert("Error!! Check console");

            })


    }
    this.getusertestdetails();
	
	this.logout = function () {
        authService.setToken();
        authService.removeUserData('Uname');
        authService.removeUserData('logged');
        $location.path('/');
    }

var dat = [];

var label = [];
$('#graph').click(function() {
			$('#pnlchart').show();
               var Id = $(this).data('testid');
                var testname = $(this).data('user');
                if(dat.length == 0)
                {
                for(var i=0;i<Id.length;i++)
                {
                  
                  dat.push(Id[i]);
                
                }
              }
 

                if(label.length == 0)
                  {
                for(var i=0;i<testname.length;i++)
                {
                  
                  label.push(testname[i]);
                }
                }

              var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'Graphical Representation For Test Attempted. ',
            data: dat,
             backgroundColor: 'rgb(153,153,0)',
            borderColor: 'rgb(255,0,0)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
            });
}]);
