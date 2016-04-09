(function() {
	"use strict";

	angular
		.module("app")
		.controller("ProfileController", ProfileController);

	ProfileController.$inject = ["$http", "$state", "$auth", "toastr",  "currentProfile"];

	function ProfileController($http, $state, $auth, toastr,  currentProfile) {
		var profile = this;
		profile.currentProfile = currentProfile;
		profile.user = currentProfile.user;
		profile.allCount = currentProfile.allCount;
		profile.topsCount = currentProfile.topsCount;
		profile.legsCount = currentProfile.legsCount;
		profile.shoesCount = currentProfile.shoesCount;
		profile.piecesCount = currentProfile.piecesCount;
		profile.totalCount = currentProfile.totalCount;
		profile.createdAt = currentProfile.createdAt;

		// var trending = this;
		// trending.tester = tester;
		// trending.trends = trends;
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