'use strict';

/**
 * Module dependencies.
 */
var noviasPolicy = require('../policies/novias.server.policy'),
  novias = require('../controllers/novias.server.controller');

module.exports = function (app) {
  // Novias collection routes
  app.route('/api/novias').all(noviasPolicy.isAllowed)
    .get(novias.list)
    .post(novias.create);

  // Single novia routes
  app.route('/api/novias/:noviaId').all(noviasPolicy.isAllowed)
    .get(novias.read)
    .put(novias.update)
    .delete(novias.delete);

  // Finish by binding the novia middleware
  app.param('noviaId', novias.noviaByID);
};
