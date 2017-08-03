/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema ({
	name:{
		type: String,
		Required: "Site Name cannot be empty"
	},
	URL:{
		type: String,
		Required: "URL cannot be blank"
	},
	API_KEY:{
		type: String
	},
	clientId:{
		type: Number,
		Required: "ClientId must be provided" //Todo: modify to be nested document
	},
	created_date:{
		type: Date,
		default: Date.now
	}
});

var Site = mongoose.model("Site", SiteSchema);

module.exports = Site;
