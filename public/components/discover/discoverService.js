(function() {
    "use strict";

    angular
        .module("app")
        .factory("DiscoverService", DiscoverService);

    DiscoverService.$inject = ["$http"];

    function DiscoverService($http) {
        var factory = {
            query:query
        };

        return factory;


        function query() {
            return $http.get("/api/v1/discover")
                .then(querySuccess)
                .catch(queryFail);
        }

        function querySuccess(discoveries) {
            console.log("discoverService data", discoveries.data);
            return discoveries.data.map(cleanDiscoveryResponse);
        }
        function queryFail(error) {
            console.log("Error retrieving discoveries.", error.data);
        }
        function cleanDiscoveryResponse(discover) {
            return {
                imgUrl: discover.images.standard_resolution.url,
                // imgUrl: discover.images.low_resolution.url,
                author: discover.user.username || "unknown",
                caption: discover.caption? discover.caption.text: "unknown"|| "unknown"
            }
        }

    }
})();