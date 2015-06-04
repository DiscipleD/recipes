var services = angular.module('recipe.services', ['ngResource']);

// using 'ngResource' module, package items (create get(), save(), query(), remove(), delete() method for every item)
services.factory('Recipe', ['$resource', function($resource){
	return $resource('/recipes/:id', {id: '@id'});
}]);

services.factory('QueryMultipRecipe', ['Recipe', '$q', function(Recipe, $q){
	return function(){
		var delay = $q.defer();
		Recipe.query(function(recipes){
			delay.resolve(recipes);
		}, function(){
			delay.reject('Unable to fetch recipes.');
		});
		
		return delay.promise;
	};
}]);

services.factory('GetRecipe', ['Recipe', '$route', '$q', function(Recipe, $route, $q){
	return function(){
		var delay = $q.defer();
		Recipe.get({id: $route.current.params.recipeId}, function(recipe){
			delay.resolve(recipe);
		}, function(){
			delay.reject('Unable to get recipe '+ $route.current.params.recipeId);
		});
		
		return delay.promise;
	};
}]);