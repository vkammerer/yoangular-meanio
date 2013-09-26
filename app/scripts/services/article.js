'use strict';

angular.module('supersetupApp')
  .factory('Article', ['$resource', function($resource) {
  	var articleUrl = window.VK_API_URL_NGRESOURCE + '/api/articles/:articleId';
  	var articleFactory = $resource(
  		articleUrl,
  		{articleId:'@id'},
  		{ "update": {method:"PUT"}
  	});
	  return articleFactory;
  }]);
