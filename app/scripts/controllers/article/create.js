'use strict';

angular.module('supersetupApp')
  .controller('ArticleCreateCtrl', ['Article','$scope', function (Article, $scope) {
    $scope.addArticle = function(article){
    	var thisArticle = new Article(article);
	  	thisArticle.$save(function(data){
	  		console.log('object successfully created')
	  		console.log(data)
	  	});
    };
  }]);
