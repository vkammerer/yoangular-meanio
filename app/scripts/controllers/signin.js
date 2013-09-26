'use strict';

angular.module('supersetupApp')
  .controller('SigninCtrl',[
  '$scope',
  '$http',
  '$location',
	function ($scope, $http, $location) {
    $scope.signIn = function(user){
    	$http.post(window.VK_API_URL + '/users/session', user)
      	.success(function(data){
          $location.path('/game')
      	})
      	.error(function(data){
      		alert(data.message)
      	})
    };
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
