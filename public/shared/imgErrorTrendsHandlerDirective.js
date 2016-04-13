(function () {
	"use strict";

	angular
		.module("app")
		.directive("imgErrorTrends", imgErrorTrends );

	imgErrorTrends.$inject = ["MyOutfitsService"];

	function imgErrorTrends (MyOutfitsService) {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				// console.log("some element", element)
				element.on("error",function(event) {
					console.log("on error event", event.type);
					console.log("element", element);
					console.log("element id", scope.outfit._id);
					console.log("element id", scope.outfit.author);
					// console.log("test", scope.myOutfits.test)
					removeBrokenLink(scope.outfit._id)
						.then(removeBrokenLinkSuccess)
						.catch(removeBrokenLinkFail);
				});

				function removeBrokenLink( outfitId) {
					return MyOutfitsService.removeTrends(outfitId)
				}
				function removeBrokenLinkSuccess(outfit) {
					console.log("Removed Broken Img Link");
					scope.trending.getTrends();
				}
				function removeBrokenLinkFail(error) {
					console.log("Error: Removing Broken Img Link",error);
					return error;
				}
			}
		}
	};


})();