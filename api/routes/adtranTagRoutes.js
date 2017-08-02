/**
 * http://usejsdoc.org/
 */

'use strict';

module.exports = function(app){
    var adtranTagController = require('../controllers/adtranTagController');

    //Get tag by containerID /containers/:containerId
    console.log("Routing to get Container");

    app.route('/container/:containerId')
        .get(adtranTagController.getTagListByContainerId);

    app.route('/containers')
        .get(adtranTagController.getContainerList)
        .post(adtranTagController.createContainer);

    app.route('/tags')
        .post(adtranTagController.createTag);
};
