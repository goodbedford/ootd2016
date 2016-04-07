(function () {
	"use strict";

	angular
		.module("app")
		.directive("isFavOutfit", isFavOutfit);

	isFavOutfit.$inject = ["$window"];

	function isFavOutfit($window) {
		var directive = {
			link: linker,
			restrict: "A"
		};

		return directive;

		function linker(scope, element, attrs, controller) {
			element.on("click", function () {
				// console.log("has Class", element.hasClass("discover-btn-is-fav"));
				if (!!$window.localStorage.getItem("currentUsername")){
					if( element.hasClass("discover-btn-is-fav")){
						element.addClass("discover-btn-not-fav");
						element.removeClass("discover-btn-is-fav");
					} else {
						element.addClass("discover-btn-is-fav");
						element.removeClass("discover-btn-not-fav");
					}
				}

			});
		}
	}

})();