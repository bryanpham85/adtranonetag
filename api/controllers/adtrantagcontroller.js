/**
 * http://usejsdoc.org/
 */
'use strict';

var mongoose = require('mongoose'),
    Container = require('../models/adtrancontainermodel'),
    Tag = require('../models/adtrantagmodel'),
    cache = require('memory-cache'),
    config = require('../../config').get(process.env.NODE_ENV);
    //htmlencode = require('htmlencode');

var scriptWrapperFirstHalf = 'function Injector(options){var containerNode,currentNode,scripts=[],init=function(){options=mergeProperties(options||{},{container:document.body,sibling:null}),containerNode=options.container,currentNode=options.sibling},mergeProperties=function(e,t){var n={};for(var r in t)t.hasOwnProperty(r)&&(void 0===e[r]?n[r]=t[r]:n[r]=e[r]);return n},fireLoadEvents=function(){var e;document.createEvent?((e=document.createEvent("HTMLEvents")).initEvent("load",!1,!0),window.dispatchEvent(e)):document.createEventObject&&(e=document.createEventObject(),document.body.fireEvent("onload",e))},documentWrite=function(e){appendHtml(e)},createTemp=function(e){var t=document.createElement("div");if("object"==typeof e&&e.parentNode)t.appendChild(e);else if("object"==typeof e&&e.length)for(;e.length;)t.appendChild(e[0]);else t.innerHTML="<span>.</span>"+e,t.removeChild(t.childNodes[0]);return t},appendHtml=function(e){var t=createTemp(e);replaceScripts(t);for(var n=t.childNodes;n.length;)appendNode(n[0])},appendNode=function(e){currentNode?currentNode.parentNode.insertBefore(e,currentNode.nextSibling):containerNode.appendChild(e),currentNode=e},replaceScripts=function(e){for(var t=e.getElementsByTagName("script"),n=t.length-1;n>=0;n--)!function(){var e=t[n],r=document.createComment("Script placeholder");e.parentNode.insertBefore(r,e),e.src&&e.parentNode.removeChild(e),scripts.unshift({placeholder:r,node:e})}()},restoreScripts=function(e,t){var n=function(){if(e.length){var r=e.shift();if(currentNode=r.placeholder,r.node.src){var o=document.createElement("script");o.type="text/javascript",o.src=r.node.src,addScriptListeners(o,n),r.placeholder.parentNode.insertBefore(o,r.placeholder)}else r.node.innerHTML?(evalInline(r.node.innerHTML),n()):n();r.placeholder.remove()}else t()};n()},addScriptListeners=function(e,t){if(e.addEventListener)e.addEventListener("error",t,!0),e.addEventListener("load",t,!0);else{if(!e.attachEvent)throw Error("Failed to attach listeners to script.");e.attachEvent("onerror",t,!0),e.attachEvent("onload",t,!0),e.attachEvent("onreadystatechange",function(){"complete"!=e.readyState&&"loaded"!=e.readyState||t()})}},evalInline=function(script){try{eval(script)}catch(e){}},expose=function(e){return function(){var t=this,n=document.write;document.write=documentWrite,e.apply(this,arguments),restoreScripts(scripts,function(){document.write=n,t.oncomplete.call()})}};this.oncomplete=function(){},this.eval=expose(function(e){evalInline(e)}),this.insert=expose(function(e){appendHtml(e)}),this.setContainer=function(e){e&&(containerNode=e)},this.setSibling=function(e){e&&(currentNode=e,containerNode=e.parentNode)},init()}\n' +
    '(new Injector()).insert(';
var scriptWrapperSecondHalf = ');';


/*Get JS Script Tag of a container*/
exports.getTagListByContainerId = function(req, res){
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

            Tag.find({tagId:{$in: tagIdList}, content_type:'application/javascript'}, function(err, tags){
               if(err){
                   console.log(err);
               }
               else{
                   respond(tags, req, res);
               }

            });
            //This function is called back when the loop finished
            var respond = function (tags, req, res) {
                console.log("Number of tag found for " + req.query.id + " is " + tags.length);
                var tagjs = "<!-------ADTRAN ONE TAG ---------->";
                for (var i = 0; i < tags.length; i++) {
                    tagjs += tags[i].script;// + "\n";
                }
                //push to cache before response

                tagjs = tagjs.replace(/"/g, '\\"');
                tagjs = tagjs.replace(/<script /g, '\\x3Cscript ');
                tagjs = tagjs.replace(/<\/script>/g, '\\x3C/script>');
                var returnTag = scriptWrapperFirstHalf + "\"" + tagjs + "\"" + scriptWrapperSecondHalf;
                let key = "__adtranonetag__" + req.originalUrl || req.url;
                cache.put(key, returnTag);
                res.setHeader("content-type", "text/javascript");
                res.send(returnTag);
            }
        });
    }
    catch(exception)
    {
        console.log(exception);
        res.send("Sorry! Unexpected error happen.");
    }
};

/*Get Non Script tag of a container*/
exports.getNSTagListByContainerId = function(req, res){
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

            //console.log("Here is the tag ID list " + tagIdList);
            Tag.find({tagId:{$in: tagIdList}, content_type:'noscript'}, function(err, tags){
                if(err){
                    console.log(err);
                }
                else{
                    respond(tags, req, res);
                }

            });
            //This function is called back when the loop finished
            var respond = function (tags, req, res) {
                console.log("Number of tag found for " + req.query.id + " is " + tags.length);
                var tagNojs = "<!-------ADTRAN ONE TAG ---------->";
                for (var i = 0; i < tags.length; i++) {
                    tagNojs += tags[i].script + "\n";
                }
                //push to cache before response
                let key = "__adtranonetag__" + req.originalUrl || req.url;
                cache.put(key, tagNojs);
                res.setHeader("content-type", "text/html");
                res.send(tagNojs);
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

exports.initData = function(req, res){
    //Check secret key to init
    if(req.query.initkey != config.initkey){
        console.log("Invalid Init request with wrong secretkey")
        res.send("You cannot take that action");
        return;
    }
    var noOfContainer = req.query.containerno;
    if(isNaN(noOfContainer)){
        console.log("Number of Init container is not a number");
        res.send("Invalid parameter");
        return;
    }

    var finishedTagCreation = false;
    var finishedContainerCreation = false;

    console.log("Initializing data for container and tag");
    /*=======Init 100 Tag==========*/
    var tagScript = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;"+
        "i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();"+
        "a=s.createElement(o),m=s.getElementsByTagName(o)[0];"+
        "a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');"+
        "ga('create', 'UA-86280021-2', 'auto');ga('send', 'pageview');";



    for (var i=0; i<100; i++){
        var tag = new Tag();
        tag.tagId = i;
        tag.script = tagScript + "\n//TagId = " + i;
        tag.save(function(err, tag){
           if(err)
               console.log(err);
           else
               console.log("Tag Created " + tag);
        });
        if((i+1)==100)
            finishedTagCreation = true;
    }

    /*=======Init as the requested number of container=====*/
    var sentinel = 0; //use to control the loop while inserting container
    /*{
        containerId:'',
        name: '',
        siteId: '1234',
        script:'',
        tags: []
    }*/
    var respond = function(res, noOfContainer){
        console.log("Created successfully + " + noOfContainer + " Containers");
        res.send("Init data sucess created + " + noOfContainer + " Containers");
    }
    for(var i=0; i<=noOfContainer; i++) {
        var container =  new Container();
        container.containerId = Math.floor(Math.random() * 1000000);
        container.name = "TagName_" + container.containerId;
        container.script = "Script of " + container.containerId;
        var noOfTag = Math.floor(Math.random() * 20);
        for (var j = 0; j < noOfTag; j++) {
            var tagId = Math.floor(Math.random() * noOfTag);
            if (!(container.tags.indexOf(tagId) >= 0))
                container.tags.push(tagId);
        }
        try {
            container.save(function (err, container) {
                if (err)
                    console.log(err);
            });
        }

        catch (exception) {
            console.log(exception);
        }

        if (++sentinel == noOfContainer)
            finishedContainerCreation = true;

    }
    while (!(finishedTagCreation && finishedContainerCreation))
        continue;
    if (finishedTagCreation && finishedContainerCreation) {
        console.log("Respond call at " + sentinel);
        respond(res, noOfContainer);
    }
};
