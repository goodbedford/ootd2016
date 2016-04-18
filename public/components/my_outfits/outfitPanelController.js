(function () {
	"use strict";

	angular
		.module("app")
		.controller("OutfitPanelController", OutfitPanelController);

	OutfitPanelController.$inject = [];

	function OutfitPanelController() {
		var outfitPanel = this;

		outfitPanel.deleteOutfitItem = deleteOutfitItem;


		function deleteOutfitItem( outfitId) {
			console.log("delete is called!", outfitId);
			// console.log("outfit panel remove", outfitPanel.remove);
			outfitPanel.remove(outfitId);

		}

	}
})();