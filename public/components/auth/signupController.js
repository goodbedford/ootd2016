(function() {
    "use strict";

    angular
        .module("app")
        .controller("SignupController", SignupController);

    SignupController.$inject = ["$state", "$auth", "$window", "toastr"];

    function SignupController($state, $auth, $window, toastr) {
        var signup = this;
        
        signup.submitSignup = submitSignup;

        function submitSignup() {
            var newUser = {username: signup.username, email: signup.email, password:signup.password};

            $auth.signup(newUser)
                .then(function(response) {
                    $window.localStorage.setItem("currentUsername", response.data.user.username);
                    $auth.setToken(response);
                    $state.go("main.discover");
                    toastr.ootdSuccess(response.data.user.username + " has successfully created a new account and is now signed-in.");
                })
                .catch(function(response) {
                    toastr.error(response.data.message);
                });
        }
    }
})();