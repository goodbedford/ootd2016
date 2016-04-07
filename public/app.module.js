//app.module.js

(function() {
    "use strict";

    angular
        .module("app", [

            //angular dependencies
            "ngResource",
            "ngMessages",
            "ngAnimate",
            "ngSanitize",

            //third party
            "toastr",
            "ui.router",
            "satellizer"
        ]);
})();