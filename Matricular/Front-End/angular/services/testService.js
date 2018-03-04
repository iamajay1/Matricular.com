myApp.factory('testService', function Factory($http, authService, $q) {

    var testArray = {};


    //sign up request
    testArray.signUp = function (userData) {
        return $http.post('/users/signup', userData);
    }

    //login request
    testArray.login = function (loginData) {
        return $http.post('/users/login', loginData);
    }
      
        //login request for facebook
    testArray.loginFacebook = function () {
        return $http.get('/auth/facebook');
    }

    //login request for google
    testArray.loginGoogle = function () {
        return $http.get('/auth/google');
    }

     // request to User Info
    testArray.userInfo = function () {
        return $http.get('/users/getUserinfo?token=' + authService.getToken());
    }

     // request to Create a test by admin
    testArray.createATest = function (data) {
        return $http.post('/Test/admin/createTest?token=' + authService.getToken(), data);
    }

    // request to Create a Question by Admin
    testArray.getTests = function (data) {
        return $http.get('/Test/allTestDetails?token=' + authService.getToken(), data);
    }

   //Query to get questions for single test
    testArray.getSingleTest = function (singleTestId) {
        //console.log(singleTestId);
        return $http.get('/Test/test/' + singleTestId + '?token=' + authService.getToken());
    }

      // request to Update test by Admin
    testArray.updateATest = function (data) {
        //console.log(data.id);
        return $http.put('/Test/test/update/' + data.id + '?token=' + authService.getToken(), data);
    }
    
     // request to delete a Test by Admin
    testArray.deleteATest = function (data) {
       // console.log(data);
        return $http.delete('/Test/test/delete/' + data + '?token=' + authService.getToken(), data);
    }

    // request to Create a Question by Admin
    testArray.createQuestions = function (data) {
        //console.log(data.id);
        return $http.post('/Test/createquestions/' + data.id + '?token=' + authService.getToken(), data);
    }

    // request to view Questions by Admin
    testArray.viewQuestions = function (data) {

        return $http.get('/Test/getquestions/' + data + '?token=' + authService.getToken(), data);
    }

    // request to Update test by Admin
    testArray.deleteAQuestion = function (data, index, quesid) {
        return $http.get('/Test/question/delete/' + data.id + '/' + index + '/' + quesid + '?token=' + authService.getToken());
    }

    testArray.getSingleQuestionDet = function (data, index) {
        return $http.get('/Test/question/getAQuesDet/' + data.id + '/' + index + '?token=' + authService.getToken(), data);
    }

    // request to Update test by Admin
    testArray.updateAQuestion = function (data, index,testid) {
        return $http.post('/Test/question/update/' + testid + '/' + index + '?token=' + authService.getToken(), data);
    }


   //Query to get questions for single test
    testArray.submitUserTestAnswer = function (data) {
        return $http.post('/Test/userTest/' + data.testid + '/questions/' + data.questionid + '/answer?token=' + authService.getToken(), data);
    }


    //Query to get questions for single test
    testArray.submitTest = function (data) {
        return $http.post('/Test/userPerform/' + data.testid + '?token=' + authService.getToken(), data);
    }


    //Query to get performance of users in dashboard
    testArray.getusertestdetails = function (userid) {
        return $http.get('/Test/performance/user/' + userid + '?token=' + authService.getToken());
    }

    // request to User Info for admin
    testArray.userInfo = function () {
        return $http.get('/users/getUserinfo?token=' + authService.getToken());
    }

    // request to forgot password for pass
    testArray.forgotPass = function (data) {
        return $http.post('/users/forgotPass',data);
    }

    // request to reset password
    testArray.resetPass = function (data) {
        return $http.post('/users/reset/'+ data.token,data);
    }
    

    return testArray;

}); //end query service
