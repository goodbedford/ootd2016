(function() {
    "use strict";

    angular
        .module("app")
        .factory("AuthService", AuthService);

    AuthService.$inject = ["$http", "$window"];

    function AuthService($http, $window) {

        var url = "http://localhost:8000/api/v1/"
        var factory = {};

        factory.setLocalStorage = setLocalStorage;
        factory.save = saveUser;



        return factory;

        function setLocalStorage(token) {
            $window.localStorage.setItem("token",token);
        }

        function saveUser(newUser) {
            $http.post(url+"signup", newUser)
                .then(function(response) {
                    console.log("new user response.data:",response.data);
                    factory.setLocalStorage(response.data.token);

                    return response.data.user;
                })
                .catch(function(err) {
                    console.log("Error submitting user",err);
                })
                .finally(function() {
                    console.log("completed new user attempt");
                });
        }

        function getUsers() {
            $http.get(url+"users")
                .then(function (response) {
                    return response;
                })
                .catch(function(err) {
                    console.log("hey error", err);
                })
        }
    }
})();