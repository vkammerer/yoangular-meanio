'use strict';

angular.module('supersetupApp')
  .controller('ArticleListCtrl', ['Article','$scope', function (Article, $scope) {
  	var queryArticles = function(){
	  	Article.query(function(data){
	  		$scope.articles = data;  			
	  	});
  	}
		$scope.deleteArticle = function(article){
			Article.delete({articleId: article._id}, function(){
				queryArticles();
			});
		}
		queryArticles();
  }]);
