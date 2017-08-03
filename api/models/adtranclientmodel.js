/**
 * http://usejsdoc.org/
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
	clientId:{
		type:Number,
		Required: "ClientId must be provided"
	},
	name:{
		type:String,
		Required: "Client Name cannot be blank"
	},
	created_date:{
		type: Date,
		default: Date.now
	}
});

var Client = mongoose.model('Client', ClientSchema)
module.exports = Client;

