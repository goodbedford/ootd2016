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
                        //controller: "NavController",
                        //controllerAs: "nav",
                        templateUrl: "../../layout/nav.html"
                    },
                    "footer": {
                        template: "<h2>footer</h2>"
                    }
                }
            })
            .state("main.discover", {
                url: "/discover",
                views: {
                    "content": {
                        templateUrl: "../../discover/discover.html"
                    }
                }
            })
            .state("main.my-outfits", {
                url: "/my-outfits",
                views: {
                    "content": {
                        templateUrl: "../../my_outfits/myOutfits.html"
                    }
                }
            })
            .state("main.trending", {
                url: "/trending",
                views: {
                    "content": {
                        templateUrl: "../../trending/trending.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/discover");

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }
})();