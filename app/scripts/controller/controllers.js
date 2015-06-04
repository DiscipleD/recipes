var controllers = angular.module('recipes', ['recipe.directives', 'recipe.services', 'ngRoute']);

controllers.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/', {
		controller: 'ListCtrl',
		resolve: {
			recipes: ['QueryMultipRecipe', function(QueryMultipRecipe){
				return QueryMultipRecipe();
			}]
		},
		templateUrl: '/views/list.html'
	});
		
	$routeProvider.when('/new', {
		controller: 'NewCtrl',
		templateUrl: '/views/recipeForm.html'
	});
	
	$routeProvider.when('/edit/:recipeId', {
		controller: 'EditCtrl',
		resolve: {
			recipe: function(GetRecipe){
				return GetRecipe();
			}
		},
		templateUrl: '/views/recipeForm.html'
	});
	
	$routeProvider.when('/view/:recipeId', {
		controller: 'ViewCtrl',
		resolve: {
			recipe: function(GetRecipe){
				return GetRecipe();
			}
		},
		templateUrl: '/views/viewRecipe.html'
	});
	
	$routeProvider.otherwise({
		redirectTo: '/'
	});
		
	// remove '#' from the url
	$locationProvider.html5Mode(true);
}]);

controllers.controller('ListCtrl', ['$scope', 'recipes', function($scope, recipes){
	$scope.recipes = recipes;
}]);

controllers.controller('ViewCtrl', ['$scope', '$location', 'recipe', function($scope, $location, recipe){
	$scope.recipe = recipe;
	
	$scope.edit = function(){
		$location.path('/edit/' + recipe.id);
	}
}]);

controllers.controller('NewCtrl', ['$scope', '$location', 'Recipe', function($scope, $location, Recipe){
	$scope.recipe = new Recipe({
		ingredients: [{}]
	});
	
	$scope.save = function(){
		$scope.recipe.$save(function(recipe){
			$location.path('/view/' + recipe.id);
		});
	};
}]);

// export 'save' and 'remove' method to $scope
controllers.controller('EditCtrl', ['$scope', '$location', 'recipe', function($scope, $location, recipe){
	$scope.recipe = recipe;
	
	// using AngularJS automatically generate 'save' method Resource, and callback will redirect to path 'view'
	$scope.save = function(){
		$scope.recipe.$save(function(recipe){
			$location.path('/view/' + recipe.id);
		});
	};
	
	// delete item only at client side
	// also can use AngularJS Resource 'delete' method, but delete is a key word in IE, so should use '$scope.recipe.$save()' or 'Recipe[delete]()' pattern
	$scope.remove = function(){
		delete $scope.recipe;
		$location.path('/');
	};
}]);

controllers.controller('IngredientsCtrl', ['$scope', function($scope){
	$scope.addIngredient = function(){
		var ingredients = $scope.recipe.ingredients;
		ingredients[ingredients.length] = {};
	};
	
	$scope.removeIngredient = function(index){
		$scope.recipe.ingredients.splice(index, 1);
	};
}]);