/**
 * http://usejsdoc.org/
 */
'use strict';

var mongoose = require('mongoose'),
    Container = require('../models/adtranContainerModel'),
    Tag = require('../models/adtranTagModel');

exports.getTagListByContainerId = function(req, res){
    console.log("In controller, get container with req " + req.params.containerId);
    Container.findOne({containerId:req.params.containerId}, function(err, container){
        if(err) {
            console.log(err);
            res.send(err);
        }
        if(container == null){
            console.log("Cannot find any container");
            res.send("No Container Found");
        }
        console.log("This is what we get from Mongo " + container);
        //Get Tag list from Container and build json objects to return
        var tagIdList = container.tags;
        var tags = [];
        var sentinel = 0;// To control the call back to function response when the loop finished
        for(var i=0; i<tagIdList.length; i++){
           Tag.findOne({tagId: tagIdList[i]}, function(err, tag){
                if(err)
                    console.log(err);
                else if(tag!==null)
                    tags.push(tag);
                if(++sentinel==tagIdList.length)
                    respond(tags, res);
            });
        }
        //This function is called back when the loop finished
        var respond = function(tags, res)
        {
            console.log(tags);
            res.json(tags);
        }
    });
};

exports.getContainerList = function(req, res){
    console.log("In controller, Get List with req " + req.params.containerId);
    Container.find({}, function(err, container){
        if(err)
            res.send(err);
        res.json(container);
    })
};

exports.createContainer = function(req, res){
    console.log("In controller, Create Container with req " + req.body);
    var new_container = new Container(req.body);
    new_container.save(function(err, container){
        if(err)
            res.send(err);
        res.json(container);
    })
};

exports.createTag = function(req, res){
    console.log("In controller, Create Tag with req " + req.body);
    var new_tag = new Tag(req.body);
    new_tag.save(function(err, tag){
        if(err)
            res.send(err);
        res.json(tag);
    })
};
