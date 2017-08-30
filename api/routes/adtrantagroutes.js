/**
 * http://usejsdoc.org/
 */

'use strict';

module.exports = function(app){
    var mcache = require('memory-cache'),
    adtranTagController = require('../controllers/adtrantagcontroller'),
    config = require('../../config').get(process.env.NODE_ENV);

//define configuration for caching

var cache = (duration, contenttype) =>{
    return (req, res, next) =>{
        var date = new Date(Date.now()).toDateString();
        var time = new Date(Date.now()).toTimeString();
        let key = '__adtranonetag__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.setHeader("content-type", contenttype);
            res.send(cachedBody);
            console.log("get from Cache for " + key + " at " + date + " " + time);
            return;
        } else {
            console.log("get from DB for key + " + key + " at " + date + " " + time);
            res.header("content-type", contenttype);
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next();
        }
    }
}

    app.route('/container.js')
        .get(cache(config.cacheduration, "text/javasript"),adtranTagController.getTagListByContainerId);

    app.route('/nscontainer.html')
        .get(cache(config.cacheduration, "text/html"),adtranTagController.getNSTagListByContainerId);

    app.route('/containers')
        .get(adtranTagController.getContainerList)
        .post(adtranTagController.createContainer);

    app.route('/tags')
        .post(adtranTagController.createTag);

    app.route('/initdata')
        .post(adtranTagController.initData);
};
