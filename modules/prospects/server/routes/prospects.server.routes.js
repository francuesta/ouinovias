'use strict';

/**
 * Module dependencies.
 */
var prospectsPolicy = require('../policies/prospects.server.policy'),
  prospects = require('../controllers/prospects.server.controller');

module.exports = function (app) {
  // Prospects collection routes
  app.route('/api/prospects').all(prospectsPolicy.isAllowed)
    .get(prospects.list)
    .post(prospects.create);

  // Single prospect routes
  app.route('/api/prospects/:prospectId').all(prospectsPolicy.isAllowed)
    .get(prospects.read)
    .put(prospects.update)
    .delete(prospects.delete);

  // Finish by binding the prospect middleware
  app.param('prospectId', prospects.prospectByID);
};
