/**
 * http://usejsdoc.org/
 */

'use strict';

module.exports = function(app){
    var mcache = require('memory-cache'),
    adtranTagController = require('../controllers/adtrantagcontroller');

//define configuration for caching

var cache = (duration) =>{
    return (req, res, next) =>{
        let key = '__adtranonetag__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody);
            console.log("get from Cache");
            return;
        } else {
            console.log("get from DB with key + " + key);
            res.header("content-type", "text/javascript");
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next();
        }
    }
}

    //Get tag by containerID /containers/:containerId
    console.log("Routing to get Container");

    //app.route('/container.js/:containerId')
    app.route('/container.js')
        .get(cache(1000),adtranTagController.getTagListByContainerId);

    app.route('/containers')
        .get(adtranTagController.getContainerList)
        .post(adtranTagController.createContainer);

    app.route('/tags')
        .post(adtranTagController.createTag);

    app.route('/initdata')
        .post(adtranTagController.initData);
};
