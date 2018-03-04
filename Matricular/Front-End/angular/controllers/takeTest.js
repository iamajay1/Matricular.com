myApp.controller('takeTestCtrl', ['$filter', '$http', '$location', '$routeParams', 'testService', 'authService', function ($filter, $http, $location, $routeParams, testService, authService) {

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
    

    //function to get the tests 
    this.getTests = function () {

        testService.getTests()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    if (response.data.data.length == 0) {
                        alert("Sorry! No Test Is Assigned By Admin!!!");
                        $location.path('/dashboard/' + main.userId);
                    } else {
                        main.testArray = response.data.data;
                    }
                }
            }, function errorCallBack(response) {
                alert("You Cancelled The Test!");

            })
    }
this.logout = function () {
        authService.setToken();
        authService.removeUserData('Uname');
        authService.removeUserData('logged');
        $location.path('/');
    }

}]);
