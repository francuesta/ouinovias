'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Service = mongoose.model('Service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a service
 */
exports.create = function (req, res) {
  var service = new Service(req.body);
  service.user = req.user;

  service.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * Show the current service
 */
exports.read = function (req, res) {
  res.json(req.service);
};

/**
 * Update a service
 */
exports.update = function (req, res) {
  var service = req.service;

  service.seq = req.body.seq;
  service.name = req.body.name;

  service.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * Delete an service
 */
exports.delete = function (req, res) {
  var service = req.service;

  service.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(service);
    }
  });
};

/**
 * List of Services
 */
exports.list = function (req, res) {
  Service.find().sort('-created').exec(function (err, services) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(services);
    }
  });
};

/**
 * Service middleware
 */
exports.serviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Service is invalid'
    });
  }

  Service.findById(id).populate('user', 'displayName').exec(function (err, service) {
    if (err) {
      return next(err);
    } else if (!service) {
      return res.status(404).send({
        message: 'No existe service con ese identificador'
      });
    }
    req.service = service;
    next();
  });
};
