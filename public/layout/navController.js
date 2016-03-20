(function() {
    "use strict";
    angular
        .module("app")
        .controller("NavController", NavController);
    NavController.$inject = [];
    function NavController() {
        var nav = this;

        nav.displayLoggedIn = false;
        nav.displaySignUp = false;

        nav.toggleLoggedIn = function() {
            nav.displayLoggedIn = !nav.displayLoggedIn;
            nav.displaySignUp = false;
            console.log("displayLoggedIn = ", nav.displayLoggedIn);
        };
        nav.toggleSignUp = function() {
            nav.displaySignUp = !nav.displaySignUp;
            nav.displayLoggedIn = false;
            console.log("displaySignUp = ", nav.displaySignUp);
        };
    }
})();