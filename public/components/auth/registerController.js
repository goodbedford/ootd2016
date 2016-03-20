(function() {
    "use strict";

    angular
        .module("app")
        .controller("RegisterController", RegisterController);

    RegisterController.$inject = ["$state", "AuthService"];

    function RegisterController($state, AuthService) {
        var register = this;
        register.submitSignup = submitSignup;
        register.setLocalStorage = AuthService.setLocalStorage;


        function submitSignup() {
            var newUser = {username: register.username, password:register.password};

            register.currentUser = AuthService.save(newUser)
            console.log("register.currentUser", register.currentUser);

            //$state.go("main.discover");
            $state.go("main.users");

            //console.log(newUser);
            //register.setLocalStorage();
        }
    }
})();