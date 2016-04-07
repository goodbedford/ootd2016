(function() {
    "use strict";

    angular
        .module("app")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$auth", "$state", "$window", "toastr"];

    function LoginController($auth, $state, $window, toastr) {
        var login = this;
        
        login.submitLogin = submitLogin;
        login.authenticate = authenticate;


        function submitLogin() {
            var newUser = {username: login.username, email: login.email, password:login.password};

            $auth.login(newUser)
                .then(function (response) {
                    $window.localStorage.setItem("currentUsernameId", response.data.user._id);
                    $window.localStorage.setItem("currentUsername", response.data.user.username);
                    $auth.setToken(response);
                    $state.go("main.discover");
                    toastr.ootdSuccess(response.data.user.username + " has successfully logged in.");

                })
                .catch(function (response) {
                    toastr.error(response.data.message);
                });
        }

        function authenticate(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    toastr.ootdSuccess("You have successfully signed in with " + provider + ".");
                    $state.go("main.discover");
                })
                .catch(function(error) {
                    if (error.error) {
                        toastr.error(error.error)
                    } else if (error.data) {
                    // http response error from server
                        toastr.error(error.data.messages, error.status) ;
                    } else {
                        toastr.error(error);
                    }
                });
        }



    }
})();