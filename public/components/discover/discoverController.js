(function () {
	"use strict";

	angular
			.module("app")
			.controller("DiscoverController", DiscoverController);

	DiscoverController.$inject = ["$auth", "$window", "DiscoverService", "MyOutfitsService"];

	function DiscoverController($auth, $window, DiscoverService, MyOutfitsService) {
		var discover = this;
		discover.isAuthenticated = isAuthenticated;
		discover.discoveries = [];
		discover.saveOutfit = saveOutfit;
		discover.addType = addType;
		discover.outfit;
		discover.seeMoreQuery = seeMoreQuery;

		getQuery()
			.then(getQuerySuccess)
			.catch(getQueryFail);


		function getQuery() {
				return DiscoverService.query()
						.then(function (discoveries) {
								console.log("discover controller", discoveries);
								discover.discoveries = discoveries;
								return discover.discoveries;
						})
						.catch(function (error) {
								console.log("Error with getQuery.", error);
						})
		}
		function getQueryFail() {
			console.log("failed query");
		}
		function getQuerySuccess(discoveries) {
			console.log("successful query");
		}
		function seeMoreQuery() {
			return DiscoverService.query()
				.then(function (discoveries) {
					console.log("discover controller", discoveries);
					discover.discoveries = discover.discoveries.concat(discoveries);
					console.log("discover.discoveries controller", discover.discoveries);

					return discover.discoveries;
				})
				.catch(function (error) {
					console.log("Error with getQuery.", error);
				})
		}
		function saveOutfit( outfity) {
			// console.log("this discover.author",outfity.author );
			// console.log("discover.outfit -",outfity);
			var outfit =  {
				imgUrl: outfity.imgUrl,
				author: outfity.author,
				type: outfity.type
			};
			
			MyOutfitsService.save(outfit)
				.then(function(response) {
				})
				.catch(function(error) {
				});
		}
		
		function saveOutfitSuccess() {
			
		}
		function saveOutfitFail() {
		}
		function addType( outfity, type) {
			outfity.type = type;

			return outfity;
		}
		function isAuthenticated () {
			return $auth.isAuthenticated();
		}
	}
})();