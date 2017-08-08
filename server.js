/**
 * http://usejsdoc.org/
 */
var express = require('express'),
	app = express(),
	//port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	config = require('./config').get(process.env.NODE_ENV);

mongoose.Promise = global.Promise;
//'mongodb://adtranonetag:123456@127.0.0.1:27017/adtranonetag'
db = mongoose.connect(config.database, {useMongoClient: true}, function(error){
	if(error) {
        console.log(error);
        process.exit(1);
    }
	else
		console.log("Connected to mongo adtranonetag");
});
//console.log(db);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/adtrantagroutes');
routes(app);

var port = config.PORT;

app.listen(port);

console.log("AdTran One Tag API Start At " + port);