"use strict";angular.module("supersetupApp",["ngRoute","ngResource"]).config(["$routeProvider","$locationProvider","$httpProvider",function($routeProvider,$locationProvider,$httpProvider){var isUserLoggedIn=function($q,$timeout,$http,$location,$rootScope){var deferred=$q.defer();return $rootScope.user?deferred.resolve():$http.get(window.VK_API_URL+"/users/me").success(function(user){"null"!==user&&($rootScope.user=user),$timeout(deferred.resolve,0)}),deferred.promise},isUserLoggedInMandatory=function($q,$timeout,$http,$location,$rootScope){var deferred=$q.defer();return $rootScope.user?deferred.resolve():$http.get(window.VK_API_URL+"/users/me").success(function(user){"null"!==user?($rootScope.user=user,$timeout(deferred.resolve,0)):(delete $rootScope.user,$rootScope.message="You need to log in.",$location.path("signin"),$timeout(function(){deferred.reject()},0))}),deferred.promise};$httpProvider.responseInterceptors.push(["$q","$location",function($q){return function(promise){return promise.then(function(response){return response},function(response){return 401===response.status&&isUserLoggedIn(),$q.reject(response)})}}]),$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{isUserLoggedIn:isUserLoggedIn}}).when("/signin",{templateUrl:"views/signin.html",controller:"SigninCtrl"}).when("/signup",{templateUrl:"views/signup.html",controller:"SignupCtrl"}).when("/signout",{template:"<div></div>",controller:"SignoutCtrl",resolve:{isUserLoggedIn:isUserLoggedInMandatory}}).when("/articles",{templateUrl:"views/article/all.html",controller:"ArticleListCtrl",resolve:{isUserLoggedIn:isUserLoggedInMandatory}}).when("/article/create",{templateUrl:"views/article/create.html",controller:"ArticleCreateCtrl",resolve:{isUserLoggedIn:isUserLoggedInMandatory}}).when("/article/:articleId/edit",{templateUrl:"views/article/edit.html",controller:"ArticleEditCtrl",resolve:{isUserLoggedIn:isUserLoggedInMandatory}}).otherwise({redirectTo:"/"})}]).run(["$http","$rootScope",function($http,$rootScope){$rootScope.appurl=window.VK_APP_URL}]),angular.module("supersetupApp").controller("MainCtrl",["$scope",function($scope){$scope.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("supersetupApp").controller("SigninCtrl",["$scope","$http","$location",function($scope,$http,$location){$scope.signIn=function(user){$http.post(window.VK_API_URL+"/users/session",user).success(function(){$location.path("/game")}).error(function(data){alert(data.message)})},$scope.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("supersetupApp").controller("SignupCtrl",["$scope","$http","$location",function($scope,$http,$location){$scope.signUp=function(user){$http.post(window.VK_API_URL+"/users",user).success(function(){$location.path("/game")}).error(function(data){alert(data.message)})}}]),angular.module("supersetupApp").directive("navigation",["$http",function(){return{templateUrl:"views/navigation.html",restrict:"E",link:function(){}}}]),angular.module("supersetupApp").controller("SignoutCtrl",["$scope","$rootScope","$http","$location",function($scope,$rootScope,$http,$location){delete $rootScope.user,$http.get(window.VK_API_URL+"/signout").success(function(){$location.path("/signin")}).error(function(data){alert(data.message)})}]),angular.module("supersetupApp").controller("ArticleListCtrl",["Article","$scope",function(Article,$scope){var queryArticles=function(){Article.query(function(data){$scope.articles=data})};$scope.deleteArticle=function(article){Article.delete({articleId:article._id},function(){queryArticles()})},queryArticles()}]),angular.module("supersetupApp").controller("ArticleCreateCtrl",["Article","$scope",function(Article,$scope){$scope.addArticle=function(article){var thisArticle=new Article(article);thisArticle.$save(function(data){console.log("object successfully created"),console.log(data)})}}]),angular.module("supersetupApp").factory("Article",["$resource",function($resource){var articleUrl=window.VK_API_URL_NGRESOURCE+"/api/articles/:articleId",articleFactory=$resource(articleUrl,{articleId:"@id"},{update:{method:"PUT"}});return articleFactory}]),angular.module("supersetupApp").controller("ArticleEditCtrl",["Article","$scope","$routeParams",function(Article,$scope,$routeParams){var articleId=$routeParams.articleId||"";articleId&&Article.get({articleId:articleId},function(article){$scope.article=article}),$scope.updateArticle=function(article){var thisArticle=new Article(article);thisArticle.$update({articleId:article._id},function(data){console.log("object successfully created"),console.log(data)})}}]),angular.module("supersetupApp").run(["$templateCache",function($templateCache){$templateCache.put("views/article/all.html",'<navigation></navigation>\n<p>This is the article list view.</p>\n<ul class="list-group">\n	<li ng-repeat="article in articles" class="list-group-item">\n		<div ng-show="(user._id === article.user._id)">\n			<a ng-href="#/article/{{article._id}}/edit"><strong>{{article.title}}</strong></a>			\n			<a ng-click="deleteArticle(article)" style="color:red;float:right;font-weight:bold;border-radius:4px;border:2px solid red; display:inline-block;padding:1px 4px;line-height:100%;cursor:pointer">X</a>\n			<p>{{article.content}}</p>\n		</div>\n		<div ng-show="(user._id !== article.user._id)">\n			<strong>{{article.title}}</strong>\n			<p>{{article.content}}</p>\n		</div>\n		<div>\n			<span>créé par </span>{{article.user.name}} ({{article.user.provider}})\n		</div>\n	</li>\n</ul>'),$templateCache.put("views/article/create.html",'<navigation></navigation>\n<form>\n	<div class="form-group">\n		<label for="title">Title</label>\n		<div>\n			<input class="form-control" type="text" ng-model="article.title" placeholder="Title"></div>\n	</div>\n	<div class="form-group">\n		<label for="content">Content</label>\n		<div>\n			<textarea class="form-control" ng-model="article.content" placeholder="Content"></textarea>\n		</div>\n	</div>\n	<div>\n		<button type="submit" class="form-control" ng-click="addArticle(article)">Add article</button>\n	</div>\n</form>'),$templateCache.put("views/article/edit.html",'<navigation></navigation>\n<form>\n	<div class="form-group">\n		<label for="title">Title</label>\n		<div>\n			<input class="form-control" type="text" ng-model="article.title" placeholder="Title"></div>\n	</div>\n	<div class="form-group">\n		<label for="content">Content</label>\n		<div>\n			<textarea class="form-control" ng-model="article.content" placeholder="Content"></textarea>\n		</div>\n	</div>\n	<div>\n		<button type="submit" class="form-control" ng-click="updateArticle(article)">Update article</button>\n	</div>\n</form>'),$templateCache.put("views/main.html","<navigation></navigation>\n<p>This is the main view.</p>"),$templateCache.put("views/navigation.html",'<nav class="navbar navbar-default" role="navigation">\n  <div class="navbar-collapse navbar-ex1-collapse">\n	<ul class="nav navbar-nav">\n		<li><a href="#/">Home</a></li>\n		<li ng-show="user"><a href="#/articles">List articles</a></li>\n		<li ng-show="user"><a href="#/article/create">Create article</a></li>\n	</ul>\n	<ul class="nav navbar-nav navbar-right">\n		<li ng-show="!user"><a href="#/signin">Sign in</a></li>\n		<li ng-show="!user"><a href="#/signup">Sign up</a></li>\n		<li ng-show="user && !(user.facebook || user.twitter || user.google)">\n			<a>\n			{{user.name}}\n			<br>\n			<img ng-src="{{user.photo}}">\n			</a>\n			<a href="#/signout">Sign out</a>\n		</li>\n		<li ng-show="user.facebook">\n			<a>\n			{{user.name}}\n			<br>\n			<img ng-src="{{user.facebook.photo}}">\n			</a>\n			<a href="#/signout">Sign out</a>\n		</li>\n		<li ng-show="user.twitter">\n			<a>\n			{{user.name}}\n			<br>\n			<img ng-src="{{user.twitter.profile_image_url}}">\n			</a>\n			<a href="#/signout">Sign out</a>\n		</li>\n		<li ng-show="user.google">\n			<a>\n			{{user.name}}\n			<br>\n			<img ng-src="{{user.google.picture}}" style="max-width:60px">\n			</a>\n			<a href="#/signout">Sign out</a>\n		</li>\n	</ul>\n	</div>\n</nav>'),$templateCache.put("views/signin.html",'<navigation></navigation>\n<form>\n	<div class="form-group">\n		<label for="email">Email</label>\n		<div>\n			<input class="form-control" type="text" ng-model="signer.email" placeholder="Email"></div>\n	</div>\n	<div class="form-group">\n		<label for="password">Password</label>\n		<div>\n			<input class="form-control" type="password" ng-model="signer.password" placeholder="Password"></div>\n	</div>\n		<div>\n		<button class="form-control" type="submit" ng-click="signIn(signer)">Sign in</button>\n	</div><br>\n	Or sign in with:\n<ul class="list-group">\n		<li class="list-group-item"><a ng-href="{{appurl + \'/auth/facebook\'}}">Facebook</a></li>\n		<li class="list-group-item"><a ng-href="{{appurl + \'/auth/twitter\'}}">Twitter</a></li>\n		<li class="list-group-item"><a ng-href="{{appurl + \'/auth/google\'}}">Google</a></li>\n	</ul>\n</form>'),$templateCache.put("views/signup.html",'<navigation></navigation>\n<form>\n	<div class="form-group">\n		<label for="name">Full Name</label>\n		<div>\n			<input class="form-control" type="text" ng-model="signer.name" placeholder="Name"></div>\n	</div>\n	<div class="form-group">\n		<label for="username">Username</label>\n		<div>\n			<input class="form-control" type="text" ng-model="signer.username" placeholder="Username"></div>\n	</div>\n	<div class="form-group">\n		<label for="email">Email</label>\n		<div>\n			<input class="form-control" type="text" ng-model="signer.email" placeholder="Email"></div>\n	</div>\n	<div class="form-group">\n		<label for="password">Password</label>\n		<div>\n			<input class="form-control" type="password" ng-model="signer.password" placeholder="Password"></div>\n	</div>\n	<div>\n		<button class="form-control" type="submit" ng-click="signUp(signer)">Sign up</button>\n	</div>\n</form>')}]);