'use strict';

/**
 * Module dependencies.
 */
var profesionalesPolicy = require('../policies/profesionales.server.policy'),
  profesionales = require('../controllers/profesionales.server.controller');

module.exports = function (app) {
  // Profesionales collection routes
  app.route('/api/profesionales').all(profesionalesPolicy.isAllowed)
    .get(profesionales.list)
    .post(profesionales.create);

  // Single profesional routes
  app.route('/api/profesionales/:profesionalId').all(profesionalesPolicy.isAllowed)
    .get(profesionales.read)
    .put(profesionales.update)
    .delete(profesionales.delete);

  // Finish by binding the profesional middleware
  app.param('profesionalId', profesionales.profesionalByID);
};
