(function() {
    "use strict";
    angular
        .module("app")
        .controller("NavController", NavController);
    NavController.$inject = ["$auth", "$http", "$q", "$window", "UserService", "toastr"];
    function NavController($auth, $http, $q, $window, UserService, toastr) {
        var nav = this;

        nav.displayLoggedIn = false;
        nav.displaySignUp = false;
        nav.isAuthenticated = isAuthenticated;
        nav.toggleLoggedIn = toggleLoggedIn;
        nav.toggleSignUp = toggleSignUp;
        nav.currentUsername =  "";

        function isAuthenticated () {
            if ($auth.isAuthenticated()) {
                nav.currentUsername =  $window.localStorage.getItem("currentUsername");
            }
            return $auth.isAuthenticated();
        }
        function toggleLoggedIn() {
            nav.displayLoggedIn = !nav.displayLoggedIn;
            nav.displaySignUp = false;
            console.log("displayLoggedIn = ", nav.displayLoggedIn);
        }

        function toggleSignUp() {
            nav.displaySignUp = !nav.displaySignUp;
            nav.displayLoggedIn = false;
            console.log("displaySignUp = ", nav.displaySignUp);
        }

    }
})();