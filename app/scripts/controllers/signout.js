'use strict';

angular.module('supersetupApp')
  .controller('SignoutCtrl', [
  	'$scope',
  	'$rootScope',
  	'$http',
	  '$location',
  	function ($scope, $rootScope, $http, $location) {
  		delete $rootScope.user;
			$http.get(window.VK_API_URL + '/signout')
				.success(function(data){
          $location.path('/signin')
				})
				.error(function(data){
					alert(data.message)
				})
  }]);
