'use strict';

angular.module('supersetupApp', ['ngRoute', 'ngResource'])
 .config(['$routeProvider', '$locationProvider', '$httpProvider',function($routeProvider, $locationProvider, $httpProvider) {
    //================================================
    // Check if the user is connected
    //================================================
    var isUserLoggedIn = function($q, $timeout, $http, $location, $rootScope){

      // Initialize a new promise
      var deferred = $q.defer();

      if (!$rootScope.user) {
        // Make an AJAX call to check if the user is logged in
        $http.get(window.VK_API_URL + '/users/me').success(function(user){
          // Authenticated
          if (user !== 'null') {
            $rootScope.user = user;
          }
          $timeout(deferred.resolve, 0);
        });
      }
      else deferred.resolve();
      return deferred.promise;
    };
    var isUserLoggedInMandatory = function($q, $timeout, $http, $location, $rootScope){

      // Initialize a new promise
      var deferred = $q.defer();

      if (!$rootScope.user) {
        // Make an AJAX call to check if the user is logged in
        $http.get(window.VK_API_URL + '/users/me').success(function(user){
          // Authenticated
          if (user !== 'null') {
            $rootScope.user = user;
            $timeout(deferred.resolve, 0);
          }

          // Not Authenticated
          else {
            delete $rootScope.user;
            $rootScope.message = 'You need to log in.';
            $location.path('signin');
            $timeout(function(){deferred.reject();}, 0);
          }
        });
      }
      else deferred.resolve();
      return deferred.promise;
    };
    $httpProvider.responseInterceptors.push(['$q', '$location', function($q, $location) {
      return function(promise) {
        return promise.then(
          // Success: just return the response
          function(response){
            return response;
          }, 
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401) {
              isUserLoggedIn();
            }
            return $q.reject(response);
          }
        );
      }
    }]);

    //================================================
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          isUserLoggedIn : isUserLoggedIn
        }
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/signout', {
        template:'<div></div>',
        controller: 'SignoutCtrl',
        resolve: {
          isUserLoggedIn : isUserLoggedInMandatory
        }
      })
      .when('/articles', {
        templateUrl: 'views/article/all.html',
        controller: 'ArticleListCtrl',
        resolve: {
          isUserLoggedIn : isUserLoggedInMandatory
        }
      })
      .when('/article/create', {
        templateUrl: 'views/article/create.html',
        controller: 'ArticleCreateCtrl',
        resolve: {
          isUserLoggedIn : isUserLoggedInMandatory
        }
      })
      .when('/article/:articleId/edit', {
        templateUrl: 'views/article/edit.html',
        controller: 'ArticleEditCtrl',
        resolve: {
          isUserLoggedIn : isUserLoggedInMandatory
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$http', '$rootScope', function( $http, $rootScope ) {
      $rootScope.appurl = window.VK_APP_URL;
  }])
