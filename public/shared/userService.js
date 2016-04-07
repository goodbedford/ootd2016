(function () {
    "use strict";
    
    angular
        .module("app")
        .factory("UserService", UserService);
    
    UserService.$inject = ["$http"];
    
    function UserService($http) {
        var factory = {
            me:me,
            query:query,
            get:get,
            save: save
        };
        var url = "/api/v1/";
        
        return factory;

        function query() {
            $http.get(url + "users")
                .then(function (users) {
                    return users.data;
                })
                .catch(function (error) {
                    console.log("Error retrieving users.", error);
                });
        }
        function get(id) {
            $http.get(url+ id)
                .then(function (user) {
                    return user.data;
                })
                .catch(function (error) {
                    console.log("Error retrieving user.", error);
                    return error;
                })
        }
        function me(id) {
            $http(url + "me")
                .then(function (me) {
                    console.log(me);
                    return me.data;
                })
                .catch(function (error) {
                    console.log("Error retrieving me.", error);
                    return error;
                })
        }
        function save(user) {
            $http.post(user)
                .then(function (user) {
                    console.log(data);
                    return user.data;
                })
                .catch(function (error) {
                    console.log("Error posting new user");
                    return error;
                })
        }
    }
})();