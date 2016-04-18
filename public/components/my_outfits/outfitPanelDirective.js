(function () {
	"use strict";
	
	angular
		.module("app")
		.directive("outfitPanel", outfitPanel);
	
	outfitPanel.$inject = [];
	
	function outfitPanel() {
		var directive = {
			templateUrl: "/components/my_outfits/outfitPanel.html",
			restrict: "E",
			scope: {
				outfit: "=",
				remove: "&"
			},
			controller: OutfitPanelController,
			controllerAs: "outfitPanel",
			bindToController: true,
			link:link
		}

		return directive;

		function link(scope, element, attrs, controller) {
			// console.log("link scope", scope.outfitPanel);
		}
		function OutfitPanelController() {
			var outfitPanel = this;
			outfitPanel.deleteOutfitItem = deleteOutfitItem;
			function deleteOutfitItem( outfitId) {
				console.log("delete is called!", outfitId);
				outfitPanel.remove()(outfitId);
			}
		}
	}
	
})();