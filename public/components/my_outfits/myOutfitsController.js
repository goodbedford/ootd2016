(function() {
	"use strict";

	angular
		.module("app")
		.controller("MyOutfitsController", MyOutfitsController);

	MyOutfitsController.$inject = ["$http", "$state", "$auth","$window", "toastr", "UserService", "MyOutfitsService"];

	function MyOutfitsController($http, $state, $auth, $window, toastr, UserService, MyOutfitsService) {
		var myOutfits = this;

		myOutfits.getOutfits = getOutfits;
		myOutfits.deleteOutfit = deleteOutfit;
		myOutfits.outfits;
		myOutfits.showError = showError;
		myOutfits.test = "godobed";
		activate();

		function activate() {
			myOutfits.getOutfits();
		}
		function showError() {
			console.log("some major error");
		}
		function getOutfits() {
			MyOutfitsService.query()
				.then(function(response) {
					console.log("MyOutfitsService response", response);
					myOutfits.user = response;
					myOutfits.outfits = myOutfits.user.outfits;
				})
				.catch(function(error) {
					console.log("Error getting outfits", error);
				});
		}

		function deleteOutfit(outfitId) {
			console.log("outfit id:", outfitId);
			MyOutfitsService.remove(outfitId)
				.then(function(response) {
					console.log("Successful delete", response);
					activate();
					// myOutfits.outfits = myOutfits.user.outfits;
					// myOutfits.user = response;
				})
				.catch(function (error) {
					console.log("Error deleting outfit.", error);
				})
		}
		// myOutfits.isAuthenticated = $auth.isAuthenticated;

		// $http.get("/api/v1/myOutfits")
		//     .then(function(response) {
		//         myOutfits.trends = response.data;
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