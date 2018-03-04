myApp.config(['$routeProvider', '$httpProvider','$locationProvider',function ($routeProvider,$httpProvider,$locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/index.html',
            controller: 'indexCtrl',
            controllerAs: 'index'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'indexCtrl',
            controllerAs: 'index'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'indexCtrl',
            controllerAs: 'index'
        })
        .when('/dashboard/:userId', {
            templateUrl: 'views/dashboard.html',
            controller: 'userDashCtrl',
            controllerAs: 'dashboard'
        })
        .when('/admindashboard/:userId', {
            templateUrl: 'views/admindashboard.html',
            controller: 'adminCtrl',
            controllerAs: 'admindash'
        })
		.when('/Admin/QuestionInfo/:userId/:testId/:testName', {
            templateUrl: 'views/testquestions.html',
            controller: 'adminCtrl',
            controllerAs: 'admindash'
        })
		.when('/takeTest/:userId', {
            templateUrl: 'views/AllTest.html',
            controller: 'takeTestCtrl',
            controllerAs: 'test'
        })
        .when('/bufferTestFetch/:testId/:userId', {
            templateUrl: 'views/test.html',
            controller: 'liveTestCtrl',
            controllerAs: 'buffertest'
        })
		.when('/forgot', {
            templateUrl: 'views/forgot.html',
            controller: 'indexCtrl',
            controllerAs: 'index'
        })
		.when('/change/:token', {
            templateUrl: 'views/change.html',
            controller: 'indexCtrl',
            controllerAs: 'index'
        })		

        .otherwise({
            template: '<p></br><h2 align="center" class="well" style="margin: 10%;">404, page not found</br></h2></p>\
			<p align="center"><button align="center"><a href="/#/" style="color:black">Index Page</a></button></p>'
        });

}]);
