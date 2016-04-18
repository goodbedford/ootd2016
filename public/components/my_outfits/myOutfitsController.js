(function() {
	"use strict";

	angular
		.module("app")
		.controller("MyOutfitsController", MyOutfitsController);

	MyOutfitsController.$inject = ["$http", "$state", "$auth","$window", "toastr", "UserService", "MyOutfitsService", "allOutfits"];

	function MyOutfitsController($http, $state, $auth, $window, toastr, UserService, MyOutfitsService, allOutfits) {
		var myOutfits = this;

		myOutfits.getOutfits = getOutfits;
		myOutfits.deleteOutfit = deleteOutfit;
		// myOutfits.user = allOutfits;
		myOutfits.outfits = allOutfits;
		myOutfits.showError = showError;
		myOutfits.test = "godobed";

		// activate();

		console.log("Im here outfits", allOutfits);
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
					// myOutfits.user = response;
					myOutfits.outfits = response;
				})
				.catch(function(error) {
					console.log("Error getting outfits", error);
				});
		}

		function deleteOutfit(outfitId) {
			console.log("delete outfit called.");
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
				});
		}
	}
})();