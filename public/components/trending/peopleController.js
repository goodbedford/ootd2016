(function() {
    "use strict";

    angular
        .module("app")
        .controller("PeopleController", PeopleController);

    PeopleController.$inject = ["AuthService"];

    function PeopleController(AuthService) {
        var people = this;

        people.getUsers = getUsers;

        people.getUsers();
        function getUsers(){
            people.users = AuthService.getUsers();
        }

    }
    //make people controller
    //add to index
    //add users to people html and ssee if the you can get restricted people,.
})();