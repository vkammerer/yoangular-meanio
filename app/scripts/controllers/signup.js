'use strict';

angular.module('supersetupApp')
  .controller('SignupCtrl',[
  '$scope',
  '$http',
  '$location',
	function ($scope, $http, $location) {
    $scope.signUp = function(user){
    	$http.post(window.VK_API_URL + '/users', user)
      	.success(function(data){
          $location.path('/game')
      	})
      	.error(function(data){
      		alert(data.message)
      	})
    };
  }]);
