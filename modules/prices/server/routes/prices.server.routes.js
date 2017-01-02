'use strict';

/**
 * Module dependencies.
 */
var pricesPolicy = require('../policies/prices.server.policy'),
  prices = require('../controllers/prices.server.controller');

module.exports = function (app) {
  // prices collection routes
  app.route('/api/prices').all(pricesPolicy.isAllowed)
    .get(prices.list)
    .post(prices.create);

  // Single price routes
  app.route('/api/prices/:priceId').all(pricesPolicy.isAllowed)
    .get(prices.read)
    .put(prices.update)
    .delete(prices.delete);

  // Finish by binding the price middleware
  app.param('priceId', prices.priceByID);
};
