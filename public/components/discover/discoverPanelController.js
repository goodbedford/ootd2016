(function () {
	"use strict";

	angular
		.module("app")
		.controller("DiscoverPanelController", DiscoverPanelController);

	DiscoverPanelController.$inject = [ "$auth", "MyOutfitsService"];

	function DiscoverPanelController( $auth, MyOutfitsService) {
		var dp = this;
		dp.saveOutfit = saveOutfit;
		dp.addType = addType;
		dp.getItem = getItem;
		dp.isFavAllClicked = isFavAllClicked;
		dp.isFavTopsClicked = isFavTopsClicked;
		dp.isFavLegsClicked = isFavLegsClicked;
		dp.isFavShoesClicked = isFavShoesClicked;
		dp.isFavPiecesClicked = isFavPiecesClicked;
		dp.isAuthenticated = $auth.isAuthenticated;

		dp.isFavAll = false;
		dp.isFavTop = false;
		dp.isFavLegs = false;
		dp.isFavShoes = false;
		dp.isFavPieces = false;

		function getItem(item) {
			console.log("get item,", item);
			var newItem = angluar.copy(item);
			return newItem;
		}

		function isFavAllClicked () {
			console.log("iam isClicked", dp.isFavAll);
			dp.isFavAll = !dp.isFavAll;
		}
		function isFavTopsClicked () {
			console.log("iam isClicked", dp.isFavTops);
			dp.isFavTops = !dp.isFavTops;
		}
		function isFavLegsClicked () {
			console.log("iam isClicked", dp.isFavLegs);
			dp.isFavLegs = !dp.isFavLegs;
		}
		function isFavShoesClicked () {
			console.log("iam isClicked", dp.isFavShoes);
			dp.isFavShoes = !dp.isFavShoes;
		}
		function isFavPiecesClicked () {
			console.log("iam isClicked", dp.isFavPieces);
			dp.isFavPieces = !dp.isFavPieces;
		}
		function saveOutfit( outfity) {
			// get the data-type property
			console.log("pressed saveOutfit");

			console.log("this discover.author",outfity.	author );
			console.log("discover.outfit -",outfity);
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



	}
})();