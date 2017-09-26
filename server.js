//url: https://friend-finder-bootcamp.herokuapp.com/

var express = require('express');

var bodyParser = require('body-parser');

var exphbs = require("express-handlebars");

var app = express();

var port = process.env.PORT;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", ".handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var profileQuestions = [
	{q: 'I would rather go to a party on the weekend than staying at home and reading a book.', id: 0},
	{q: 'I often regret the missed connections in my life.', id: 1},
	{q: 'I have already noticed that this questionnaire has every question start with "I".', id: 2},
	{q: 'I am ok with this.', id: 3},
	{q: 'Well, maybe not every question.', id: 4},
	{q: 'I already took the Myers Briggs test and think it\'s bullshit.', id: 5},
	{q: 'I know that this test won\'t actually give me any friends.', id: 6},
	{q: 'I believe that I have the confidence and initiative to get anyone to do anything I want them to.', id: 7},
	{q: 'I have a car.', id: 8},
	{q: 'I want this survey to just end already.', id: 9}
]

var profileArray = [];

var Profile = function (name, scores) {
	this.profileName = name;
	this.profileScoreArray = scores;
};

function createProfile(name, scores){
	var newProfile = new Profile(name, scores);
	profileArray.push(newProfile);
}

function compareProfiles(req){
	var ans = req.answers;
	var totalDiffArray = [];
	for (var i = 0; i < profileArray.length; i++) {
		var diffArray = [];
		for (var j = 0; j < profileArray[i].profileScoreArray.length; j++) {
			 diffArray.push(Math.abs(ans[j] - profileArray[i].profileScoreArray[j]))
		}
		profileArray[i].sum = diffArray.reduce(function (total, num) {
			return total + num;
		});
	}
	var sortedArray = profileArray.sort(function(a, b){
			return a.sum - b.sum;
		})
	return sortedArray;
}

createProfile('Genevieve', [2,5,3,5,4,1,2,4,5,3]);

createProfile('Robert', [3,4,1,2,5,4,2,3,4,1]);

app.get('/', function(request, response){
	response.render('survey', {questions: profileQuestions});
})

app.post('/', function (request, response) {
	var friends = compareProfiles(request.body)
	response.redirect('/home?friends=' + JSON.stringify(friends))
})

app.get("/home", function(req, res) {
	var list = JSON.parse(req.query.friends);
	res.render('home', {friends: list});
})

app.listen(3000, function(){
	console.log('listening on port '+port);
})