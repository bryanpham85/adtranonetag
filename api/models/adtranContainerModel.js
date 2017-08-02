/**
 * http://usejsdoc.org/
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tag = require('./adtrantagmodel');

var ContainerSchema = new Schema({
	containerId:{
		type: Number,
		Required: "Container ID cannot be empty"
	},
	name:{
		type: String,
		Required: "Container Name cannot be empty"
	},
	script: {
        type: String
    },
	siteId:{
		type: Number,
		Required: "SiteId cannot be blank" //Todo: modify to be nested document
	},
	tags: {
        type: [Number]
    }
});

var Container = mongoose.model("Container", ContainerSchema);
module.exports = Container;