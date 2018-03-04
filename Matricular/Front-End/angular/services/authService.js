//Authorization Factory to manage token
myApp.factory('authService', ['$window','$rootScope','$location', function ($window,$rootScope, $location) {

    var authToken = {};

    //accesing local storage through $window service
    var store = $window.localStorage;
    var key = 'x-auth-token';

    //function to get token from local storage
    authToken.getToken = function () {
        return store.getItem(key);

    }
    //function to set token to local storage
    authToken.setToken = function (token) {
        if (token) {
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    }
    authToken.setUserData=function(key, data) {
            store.setItem(key, data);
    }
    authToken.getUserData =function(key){
        return store.getItem(key);
    }
    authToken.removeUserData =function(key){
        return store.removeItem(key);
    }

    return authToken;


}]);
