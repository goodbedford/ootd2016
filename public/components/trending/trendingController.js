(function () {
	"use strict";

	angular
		.module("app")
		.controller("TrendingController", TrendingController);

	TrendingController.$inject = ["$http", "$state", "$auth", "toastr", "MyOutfitsService", "trends"];

	function TrendingController($http, $state, $auth, toastr, MyOutfitsService, trends) {
		var trending = this;
		trending.trends = trends;
		trending.deleteOutfit = deleteOutfit;
		trending.getTrends = getTrends;

		function activate() {
			getTrends();
		}
		function getTrends() {
			return $http.get("/api/v1/trending")
				.then(function (trends) {
					trending.trends = trends.data;
				})
				.catch(function(error) {
					console.log("Error receiving trends.", error);
					$state.go("main.discover");

				});
		}
		function deleteOutfit(outfitId) {
			console.log("outfit id:", outfitId);
			MyOutfitsService.removeTrends(outfitId)
				.then(function (response) {
					console.log("Successful delete", response);
					activate();
					// myOutfits.outfits = myOutfits.user.outfits;
					// myOutfits.user = response;
				})
				.catch(function (error) {
					console.log("Error deleting outfit.", error);
				})
		}
	}
})();