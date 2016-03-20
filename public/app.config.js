// app.config

(function() {
    "use strict";

    angular
        .module("app")
        .config(config);


    config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];

    function config($locationProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("main", {
                url: "",
                abstract:true,
                views: {
                    "main": {
                        templateUrl: "../../layout/layout.html"
                    },
                    "nav": {
                        controller: "NavController",
                        controllerAs: "nav",
                        templateUrl: "../../layout/nav.html"
                    },
                    "footer": {
                        templateUrl: "../../layout/footer.html"
                    },
                    //"login@main": {
                    //    templateUrl: "../../components/auth/login.html",
                    //    controller: "AuthController",
                    //    controllerAs: "login"
                    //}
                }
            })
            .state("main.login", {
                url:"/login",
                views: {
                    "content": {
                        templateUrl: "../../components/auth/login.html",
                        controller: "LoginController",
                        controllerAs: "login"
                    }
                }
            })
            .state("main.register", {
                url: "/register",
                views: {
                    "content": {
                        templateUrl: "../../components/auth/register.html",
                        controller: "RegisterController",
                        controllerAs: "register"
                    }
                }
        })
            .state("main.discover", {
                url: "/discover",
                views: {
                    "content": {
                        templateUrl: "../../components/discover/discover.html"
                    }
                }
            })
            .state("main.my-outfits", {
                url: "/my-outfits",
                views: {
                    "content": {
                        templateUrl: "../../components/my_outfits/myOutfits.html"
                    }
                }
            })
            .state("main.trending", {
                url: "/trending",
                views: {
                    "content": {
                        templateUrl: "../../components/trending/trending.html"
                    }
                }
            })
            .state("main.users", {
                url: "/users",
                views: {
                    "content": {
                        templateUrl: "../../components/trending/people.html",
                        controller: "peopleController",
                        controllerAs: "people"
                    }
                }
            })

        $urlRouterProvider.otherwise("/discover");

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }
})();