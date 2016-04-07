(function() {
    "use strict";

    angular
        .module("app")
        .controller("TrendingController", TrendingController);

    TrendingController.$inject = ["$http", "$state", "$auth", "toastr", "tester", "trends"];

    function TrendingController($http, $state, $auth, toastr, tester, trends) {
        var trending = this;
        trending.tester = tester;
        trending.trends = trends;
        // trending.isAuthenticated = $auth.isAuthenticated;

        // $http.get("/api/v1/trending")
        //     .then(function(response) {
        //         trending.trends = response.data;
        //         console.log("the response",response);
        //     })
        //     .catch(function (response) {
        //         console.log("error", response);
        //         toastr.error(response.data.message, {
        //             closeButton: true
        //         });
        //
        //         // $state.go("main.discover");
        //
        //     })
    }
})();