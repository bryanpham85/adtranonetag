/**
 * http://usejsdoc.org/
 */
var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');
	//config = require('./config').get(process.env.NODE_ENV);

var db_connection = process.env.ONETAG_MONGODB_CONNECTION;
var config_port = process.env.ONETAG_PORT;


mongoose.Promise = global.Promise;
/**
db = mongoose.connect(config.database, {useMongoClient: true}, function(error){
	if(error) {
        console.log(error);
        process.exit(1);
    }
	else
		console.log("Connected to mongo adtranonetag");
});
 **/
db = mongoose.connect(db_connection, {useMongoClient: true}, function(error){
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

//var port = config.PORT;

app.listen(config_port);

console.log("AdTran One Tag API Start At " + config_port);