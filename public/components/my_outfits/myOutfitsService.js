(function () {
	"use strict";

	angular
		.module("app")
		.factory("MyOutfitsService", MyOutfitsService);

	MyOutfitsService.$inject = ["$http", "$window", "$state"];

	function MyOutfitsService($http, $window, $state) {
		var factory = {
			me:me,
			query:query,
			get:get,
			save: save,
			remove: remove
		};
		var url = "/api/v1/users/outfits/";
		var currentUserId = $window.localStorage.getItem("currentUsernameId");
		return factory;

		function query() {
			return $http.get(url)
				.then(querySuccess)
				.catch(queryFail);
		}
		function get(id) {
			$http.get(url+ id)
				.then(getSuccess)
				.catch(getFail)
		}
		function me() {
			$http.get(url + "me")
				.then(meSuccess)
				.catch(meFail)
		}
		function save(outfit) {
			console.log("enterd save service pre post");
			return $http.post(url,  outfit)
				.then(saveSuccess)
				.catch(saveFail)
		}

		function remove(outfitId) {
			return $http.delete(url + outfitId)
				.then(function (user) {
					console.log("Successful Delete.", user.data);
					return user.data;
				})
				.catch(function (error) {
					return console.log("Error Deleting outfit from db:", error);
				})
		}

		function querySuccess(user) {
			console.log("myOutfit successful user", user.data);
			return user.data;
		}
		function queryFail (error) {
			console.log("Error retrieving users.", error);
			if (error.status === 401) {
				console.log("Error.Status", error.status);
				$state.go("main.logout");
			}
		}
		function getSuccess(user) {
			return user.data;
		}
		function getFail(error) {
			console.log("Error retrieving user.", error);
			return error;
		}
		function meSuccess(me) {
			console.log(me);
			return me.data;
		}
		function meFail (error) {
			console.log("Error retrieving me.", error);
			return error;
		}
		function saveSuccess(user) {
			console.log("saveSuccess:", user.data);
			return user.data;
		}
		function saveFail(error) {
			console.log("Error posting new user", error);
			return error;
		}
	}
})();