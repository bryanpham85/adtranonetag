/**
 * http://usejsdoc.org/
 */
'use strict';

var mongoose = require('mongoose'),
    Container = require('../models/adtrancontainermodel'),
    Tag = require('../models/adtrantagmodel');

exports.getTagListByContainerId = function(req, res){
    console.log("In controller, get container with req " + req.query.id);
    //update from /containerId to ?id= URL pattern
    if(isNaN(req.query.id)){
        res.send("ContainerID should be a number");
        return;
    }
    try {
        Container.findOne({containerId: req.query.id}, function (err, container) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            if (container == null) {
                console.log("Cannot find any container");
                res.send("No Container Found");
                return;
            }
            //Get Tag list from Container and build json objects to return
            var tagIdList = container.tags;

            console.log("Here is the tag ID list " + tagIdList);
            Tag.find({tagId:{$in: tagIdList}}, function(err, tags){
               if(err){
                   console.log(err);
               }
               else{
                   console.log(tags);
                   respond(tags, res);
               }

            });
            //This function is called back when the loop finished
            var respond = function (tags, res) {
                console.log(tags);
                var tagjs = "//-------ADTRAN ONE TAG ----------\n";
                for (var i = 0; i < tags.length; i++) {
                    tagjs += tags[i].script + "\n";
                }
                res.setHeader("content-type", "text/javascript");
                res.end(tagjs);
                //res.json(tags);
            }
        });
    }
    catch(exception)
    {
        console.log(exception);
        res.send("Sorry! Unexpected error happen.");
    }
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
