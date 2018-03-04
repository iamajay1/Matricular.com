myApp.controller('indexCtrl', ['$http', '$window','$location','$routeParams', 'testService', 'authService', function ($http,$window, $location,$routeParams, testService, authService) {

   var main = this;
    //check if logged

    this.logged = function () {
        main.userID = testService.userId;
        
		main.username = authService.getUserData('Uname');
        main.login=authService.getUserData('logged'); 
        if (main.login=="1" && testService.log == 1 && testService.userId !== 'undefined') {
            return 1;
        } else {
            return 0;
        }
    }

    this.logged();
   
//function to send recovery password
this.forgotPassword=function(){

 var data = {
            email: main.email
        }
    testService.forgotPass(data)
    .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                    $location.path('/login');
                } else if (response.data) {
                   alert(response.data.msg);
                  $location.path('/login');
                } 
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });

}

//function to reset password

this.resetPassword=function(){
 var data = {
            email: main.email,
            password:main.password,
            confirm:main.confirm,
            token:$routeParams.token

        }
    testService.resetPass(data)
    .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                    $location.path('/login');
                } else if (response.data) {
                   alert(response.data.msg);
                  $location.path('/login');
                } 
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });

}



    //function to  login
    this.submitLog = function () {

        var data = {
            email: main.email,
            password: main.password
        }

        testService.login(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else if (response.data.data.name == 'Admin') {
                   var data = response.data.data;
                    authService.setToken(response.data.token);
                   authService.setUserData('Uname',data.name);
                   authService.setUserData('logged','1');
                   $location.path('/admindashboard/' + data._id);

                } else {
                    authService.setToken(response.data.token);
                     var data = response.data.data;
                     authService.setUserData('Uname',data.name);
                     authService.setUserData('logged','1');
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallBack(response) {
                alert("Error!! Check console");
            });
    } //end submitLog

    //function to  signup
    this.submitSign = function () {

        var data = {
            name: main.name,

            email: main.email,
            password: main.password,
            mobileNumber: main.mobileNumber
        }

        testService.signUp(data)
            .then(function successCallBack(response) {
                //console.log(response);
                if (response.data.error === true) {
                    alert(response.data.message)
                } else {

                    if (response.data.data.name == 'Admin') {
                        authService.setToken(response.data.token);
                         var data = response.data.data;
                        authService.setUserData('Uname',data.name);
                        authService.setUserData('logged','1');
                        $location.path('/admindashboard/' + data._id);

                    } else {
                        authService.setToken(response.data.token);
                        var data = response.data.data;
                         authService.setUserData('Uname',data.name);
                         authService.setUserData('logged','1');
                        $location.path('/dashboard/' + data._id);
                    }
                }
            }, function errorCallBack(response) {
                //console.log(response);
                if (response.status === 400) {
                    alert(response.data);
                } else {
                    alert(response.data.message);
                }
            });

    } //end submitSign


//function to facebook Login
    this.submitFacebook = function () {
        testService.loginFacebook()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {

                    var userId;
                    var data = response.data;
                    console.log(data);
                    //set logged status  
                    testService.log = 1;
                    testService.userId = data._id;

                    //console.log(main.userId);
                    authService.setToken(data.token);
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");
            });
    }

    //function to google Login

    this.submitGoogle = function () {

        testService.loginGoogle()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {

                    var userId;
                    var data = response.data;
                    authService.setUserData('Uname',data.name);
                    authService.setToken(data.token);
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("Error!! Check console");
            });
    }

//function to logout
this.logout = function () {
        authService.setToken();
        authService.removeUserData('Uname');
        authService.removeUserData('logged');
        $location.path('/');
    }


}]);
