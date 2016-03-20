(function () {
    "use strict";

    angular
        .module("app")
        .factory("AuthInterceptor", AuthInterceptor);

    AuthInterceptor.$inject = [];

    function AuthInterceptor(config) {
        var factory = {};

        factory.request = request;


        return factory;

        function request() {
            config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }


    }


})();