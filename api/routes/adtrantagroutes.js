/**
 * http://usejsdoc.org/
 */

'use strict';

var cache_duration = process.env.ONETAG_CACHE_DURATION;

module.exports = function(app){
    var mcache = require('memory-cache'),
    adtranTagController = require('../controllers/adtrantagcontroller'),
    log4js = require('log4js');
//config = require('../../config').get(process.env.NODE_ENV),

//configure log4js
log4js.configure({
   appenders:{
       tagReqLogs: {type: 'dateFile', filename:'log/requestlog.log', pattern:'-yyyy-MM-dd', 'alwaysIncludePattern':true},
       console: {type: 'console'}
   },
    categories: {
       requestLog: {appenders:['tagReqLogs'], level:'info'},
        default: {appenders: ['console'], level:'trace'}
    }
});
//define configuration for caching
const logger = log4js.getLogger('requestLog');

var cache = (duration, contenttype) =>{
    return (req, res, next) =>{
        var date = new Date(Date.now()).toDateString();
        var time = new Date(Date.now()).toTimeString();
        let key = '__adtranonetag__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        //Proceed log to file the info of request.
        var agent = req.get('User-Agent');
        var ip = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).split(",")[0];

        logger.info(key + " from " + agent + " with IP " + ip);

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
        .get(cache(cache_duration, "text/javascript"),adtranTagController.getTagListByContainerId);

    app.route('/nscontainer.html')
        .get(cache(cache_duration, "text/html"),adtranTagController.getNSTagListByContainerId);

    app.route('/containers')
        .get(adtranTagController.getContainerList)
        .post(adtranTagController.createContainer);

    app.route('/tags')
        .post(adtranTagController.createTag);
};
