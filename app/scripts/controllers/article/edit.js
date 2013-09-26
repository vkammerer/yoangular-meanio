'use strict';

angular.module('supersetupApp')
  .controller('ArticleEditCtrl', ['Article', '$scope','$routeParams', function (Article, $scope, $routeParams) {
  	var articleId = $routeParams.articleId || "";
  	if (articleId) {
  		Article.get({articleId:articleId}, function(article){
  			$scope.article = article;
  		})
  	}
		$scope.updateArticle = function(article){
			var thisArticle = new Article(article);
			thisArticle.$update({articleId:article._id}, function(data){
        console.log('object successfully created')
        console.log(data)
      });
		};
  }]);
