/**
 * http://usejsdoc.org/
 */
var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	config = require('./config').get(process.env.NODE_ENV);

mongoose.Promise = global.Promise;
db = mongoose.connect(config.database, {useMongoClient: true}, function(error){
	if(error) {
        console.log(error);
        process.exit(1);
    }
	else
		console.log("Connected to mongo adtranonetag");
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/adtrantagroutes');
routes(app);

var port = config.PORT;

app.listen(port);

console.log("AdTran One Tag API Start At " + port);