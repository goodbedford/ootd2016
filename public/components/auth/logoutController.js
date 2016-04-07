(function () {
    "use strict";
    
    angular
        .module("app")
        .controller("LogoutController", LogoutController);
    
    LogoutController.$inject = ["$auth", "$state", "$window", "toastr"];
    
    function LogoutController($auth, $state, $window, toastr) {
        var logout = this;
 
        console.log("logging out page");
        logout.loggingOut = loggingOut;

        logout.loggingOut();

        function loggingOut() {
            $auth.logout()
                .then(function() {
                    toastr.ootdSuccess($window.localStorage.getItem("currentUsername") +" is now logged out.");
                    $window.localStorage.removeItem("currentUsername");
                    $state.go("main.discover");
                })
                .catch(function () {
                    console.log("Error with logout.");
                    $state.go("main.discover");
                });
        }
    }
    
})();