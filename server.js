var path = require('path');
var fs = require('fs');

var RECIPESDBFILEPATH = __dirname + '/data/recipes.json';

var express = require('express');
var app = express();
var port = parseInt(process.env.PORT, 10) || 9088;

var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

// inject server middleware

	app.use(logger('logger'));
	app.use(methodOverride());
	app.use(bodyParser());
	app.use(express.static(path.join(__dirname, '/app')));
	app.use(errorHandler());
	// app.router is not exist in express 4.x
	//app.use(app.router);

function Recipes(){
	var recipesList;
}

Recipes.prototype.loadList = function(){
	var self = this;
	fs.readFile(RECIPESDBFILEPATH, function(err, data){
		if (err) throw err;
		self.recipesList = JSON.parse(data.toString());
	});
}

Recipes.prototype.getRecipesList = function(){
	return this.recipesList;
}

Recipes.prototype.getRecipe = function(id){
	
	for (index in recipes.recipesList){
		
		if (recipes.recipesList[index].id == id){
			return recipes.recipesList[index];
		}
	}
	return {};
}

Recipes.prototype.setRecipe = function(recipe){
	
	var findRecipe = false;
	
	for (index in recipes.recipesList){
		
		if (recipes.recipesList[index].id == recipe.id){
			findRecipe = true;
			recipes.recipesList[index] = recipe;
		}
	}
	// can not find exist id in the recipes list, and push the recipe into the list
	if (!findRecipe){
		recipes.recipesList.push(recipe);
	}
	
	recipes.saveRecipes();
}

Recipes.prototype.removeRecipe = function(recipe){
	for (index in recipes.recipesList){
		
		if (recipes.recipesList[index].id == recipe.id){
			recipes.recipesList.splice(index, 1);
			break;
		}
	}
	
	recipes.saveRecipes();
}

Recipes.prototype.saveRecipes = function(){
	var data = JSON.stringify(recipes.recipesList);
	fs.writeFile(RECIPESDBFILEPATH, data);
}

//create recipes object
var recipes = new Recipes();

app.get('/recipes', function(req, res) {
    var list = [];

    list = recipes.getRecipesList();

  // Simulate delay in server, just to show the loader is worked.
  setTimeout(function() {
    res.send(list);
  }, 500);
});

app.get('/recipes/:id', function(req, res) {
    console.log('Requesting recipe with id', req.params.id);
    var recipe = recipes.getRecipe(req.params.id);
	console.log(recipe);

	res.send(recipe);
});

app.post('/recipes', function(req, res) {
    var recipe = {};
    recipe.id = recipes.recipesList.length + 1;
    recipe.title = req.body.title;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;

	recipes.setRecipe(recipe);
	
	res.send(recipe);

});

app.post('/recipes/:id', function(req, res) {
    var recipe = {};
    recipe.id = req.params.id;
    recipe.title = req.body.title;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;

	recipes.setRecipe(recipe);
	
	res.send(recipe);

});

app.delete('/recipes/:id', function(req, res) {
    var recipe = recipes.getRecipe(req.params.id);

	recipes.removeRecipe(recipe);
	
	res.send(recipe);

});

app.listen(port, function(){
	console.log('Express server listening on port ' + port);
	recipes.loadList();
});