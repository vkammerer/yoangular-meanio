'use strict';

angular.module('supersetupApp')
  .directive('navigation', ['$http', function ($http) {
    return {
      templateUrl: 'views/navigation.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      },
    };
  }]);
