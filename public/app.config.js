// app.config

(function () {
	"use strict";

	angular
		.module("app")
		.config(config);

	config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider", "$authProvider"];

	function config($locationProvider, $stateProvider, $urlRouterProvider, $authProvider) {
		$stateProvider
			.state("main", {
				url: "",
				abstract: true,
				views: {
					"main": {
						templateUrl: "../../layout/layout.html"
					},
					"nav": {
						controller: "NavController",
						controllerAs: "nav",
						templateUrl: "../../layout/nav.html"
					},
					"footer": {
						templateUrl: "../../layout/footer.html"
					},
					//"login@main": {
					//    templateUrl: "../../components/auth/login.html",
					//    controller: "AuthController",
					//    controllerAs: "login"
					//}
				}
			})
			.state("main.login", {
				url: "/login",
				views: {
					"content": {
						templateUrl: "../../components/auth/login.html",
						controller: "LoginController",
						controllerAs: "login",
						resolve: {
							// skipIfLoggedIn: skipIfLoggedIn
						}
					}
				}
			})
			.state("main.signup", {
				url: "/signup",
				views: {
					"content": {
						templateUrl: "../../components/auth/signup.html",
						controller: "SignupController",
						controllerAs: "signup",
						resolve: {
							// skipIfLoggedIn: skipIfLoggedIn
						}
					}
				}
			})
			.state("main.logout", {
				url: "/logout",
				views: {
					"content": {
						template: null,
						// templateUrl: "../../components/auth/logout.html",
						controller: "LogoutController",
						controllerAs: "logout",
					}
				}
			})
			.state("main.discover", {
				url: "/",
				views: {
					"content": {
						templateUrl: "../../components/discover/discover.html",
						controller: "DiscoverController",
						controllerAs: "discover"
					}
				}
			})
			.state("main.my-outfits", {
				url: "/my-outfits",
				views: {
					"content": {
						templateUrl: "../../components/my_outfits/myOutfits.html",
						controller: "MyOutfitsController",
						controllerAs: "myOutfits",
						resolve: {
							// loginRequired: loginRequired,
							allOutfits: allOutfits
					}
				}
			}
			})
			.state("main.trending", {
				url: "/trending",
				views: {
					"content": {
						templateUrl: "../../components/trending/trending.html",
						controller: "TrendingController",
						controllerAs: "trending",
						resolve: {
							loginRequired: loginRequired,
							trends: trends
						}
					}
				}
			})
			.state("main.profile", {
				url: "/profile",
				views: {
					"content": {
						templateUrl: "../../components/profile/profile.html",
						controller: "ProfileController",
						controllerAs: "profile",
						resolve: {
							loginRequired: loginRequired,
							currentProfile: getCurrentProfile
						}
					}
				}
			});
			// .state("main.otherwise", {
			// 	url: "*path",
			// 	views: {
			// 		"content": {
			// 			templateUrl: "../../components/discover/discover.html",
			// 			controller: "DiscoverController",
			// 			controllerAs: "discover"
			// 		}
			// 	}
			// });

		$urlRouterProvider.when("/logout", "/discover");
		$authProvider.signupUrl = "/api/v1/signup";
		$authProvider.loginUrl = "/api/v1/login";
		// $authProvider.loginRedirect = "/discover";
		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});
		// $urlRouterProvider.otherwise("/discover");
		$urlRouterProvider.otherwise(function($injector, $location){
			var $state = $injector.get("$state");

			$state.go("main.discover");
		});

		function allOutfits(MyOutfitsService) {
			return MyOutfitsService.query();
			// $http.get("/api/v1/users/outfits/")
				// .then(allOutfitsSuccess)
				// .catch(allOutfitsFail);
		}
		function allOutfitsSuccess(user) {
			console.log("all outfits success", user.data);
			return user.data;
		}
		function trends($http, $state, toastr) {
			return $http.get("/api/v1/trending")
				.then(function (response) {
					// toastr.success("Check out the latest trends.");
					console.log("the response", response);
					return response.data;
				})
				.catch(function (response) {
					console.log("error", response);
					toastr.error(response.data.message);
					$state.go("main.discover");
				});
		}
		function getCurrentProfile($http, $state, toastr) {
			return $http.get("/api/v1/profile")
				.then(getCurrentProfileSuccess)
				.catch(getCurrentProfileFail);
		}
		function getCurrentProfileSuccess(response) {
			console.log("the profile response", response.data);
			return response.data;
		}
		function getCurrentProfileFail(error) {
			console.log("Error retrieving profile data.", error);
			toastr.error(error.data.message);
			$state.go("main.discover");
		}
		function skipIfLoggedIn($q, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				console.log("Already logged in.");
				deferred.reject();
			} else {
				deferred.resolve();
			}
			return deferred.promise;
		}
		function loginRequired($q, $auth, $state) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.resolve();
			} else {
				$state.go("main.login");
				// $location.path('/login');
			}
			return deferred.promise;
		}
	}

})();