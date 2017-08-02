/**
 * http://usejsdoc.org/
 */
var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	//Container = require('./api/models/adtranContainerModel'),
	bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
db = mongoose.connect('mongodb://127.0.0.1:27017/adtranonetag', {useMongoClient: true}, function(error){
	if(error)
		console.log(error);
});
//console.log(db);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/adTranTagRoutes');
routes(app);

app.listen(port);

console.log("AdTran One Tag API Start At " + port);