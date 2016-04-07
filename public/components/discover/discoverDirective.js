(function () {
	"use strict";
	
	angular
		.module("app")
		.directive("ootdDiscoverPanel", ootdDiscoverPanel);

	ootdDiscoverPanel.$inject = [];

	function ootdDiscoverPanel() {
		var directive = {
			templateUrl:"/components/discover/discoverPanel.html",
			restrict: "E",
			link: link,
			scope: {
				discoverItem: "=?item"

			},
			// scope: true,
			controller: "DiscoverPanelController",
			controllerAs: "dp",
			bindToController: true,
		}
		return directive;

		function link($scope, element, attrs, controller) {
			console.log("link controller", controller.discoverItem);
			console.log("link scope", $scope.dp);
		}
	}
	
})();