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
	
var recipes_map = {
  '1': {
    "id": "1",
    "title": "Cookies",
    "description": "Delicious, crisp on the outside, chewy on the outside, oozing with chocolatey goodness cookies. The best kind",
    "ingredients": [
      {
        "amount": "1",
        "amountUnits": "packet",
        "ingredientName": "Chips Ahoy"
      }
    ],
    "instructions": "1. Go buy a packet of Chips Ahoy\n2. Heat it up in an oven\n3. Enjoy warm cookies\n4. Learn how to bake cookies from somewhere else"
  },
  '2': {
    id: 2,
    'title': 'Recipe 2',
    'description': 'Description 2',
    'instructions': 'Instruction 2',
    ingredients: [
      {amount: 13, amountUnits: 'pounds', ingredientName: 'Awesomeness'}
    ]
  }
};
var next_id = 3;

app.get('/recipes', function(req, res) {
  var recipes = [];

  fs.readFile(RECIPESDBFILEPATH, function(err, data){
	  if (err) throw err;
	  recipes = JSON.parse(data.toString());
  })

  // Simulate delay in server
  setTimeout(function() {
    res.send(recipes);
  }, 500);
});

app.get('/recipes/:id', function(req, res) {
  console.log('Requesting recipe with id', req.params.id);
  res.send(recipes_map[req.params.id]);
});

app.post('/recipes', function(req, res) {
  var recipe = {};
  recipe.id = next_id++;
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  recipes_map[recipe.id] = recipe;

  res.send(recipe);
});

app.post('/recipes/:id', function(req, res) {
  var recipe = {};
  recipe.id = req.params.id;
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  recipes_map[recipe.id] = recipe;

  res.send(recipe);
});

app.listen(port, function(){
	console.log('Express server listening on port ' + port);
});