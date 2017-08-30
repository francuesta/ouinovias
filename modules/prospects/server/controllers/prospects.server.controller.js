'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Prospect = mongoose.model('Prospect'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a prospect
 */
exports.create = function (req, res) {
  var prospect = new Prospect(req.body);
  prospect.user = req.user;

  prospect.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(prospect);
    }
  });
};

/**
 * Show the current prospect
 */
exports.read = function (req, res) {
  res.json(req.prospect);
};

/**
 * Update a prospect
 */
exports.update = function (req, res) {
  var prospect = req.prospect;

  prospect.name = req.body.name;
  prospect.surname = req.body.surname;
  prospect.phone = req.body.phone;
  prospect.email = req.body.email;
  prospect.weddingDate = req.body.weddingDate;
  prospect.weddingHour = req.body.weddingHour;
  prospect.weddingPlace = req.body.weddingPlace;
  prospect.weddingComments = req.body.weddingComments;
  prospect.billingDate = req.body.billingDate;
  prospect.bride = req.body.bride;

  prospect.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(prospect);
    }
  });
};

/**
 * Delete an prospect
 */
exports.delete = function (req, res) {
  var prospect = req.prospect;

  prospect.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(prospect);
    }
  });
};

/**
 * List of Prospects
 */
exports.list = function (req, res) {
  Prospect.find().sort('-created').populate('user', 'displayName').exec(function (err, prospects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(prospects);
    }
  });
};

/**
 * Prospect middleware
 */
exports.prospectByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Prospect is invalid'
    });
  }

  Prospect.findById(id).populate('user', 'displayName').exec(function (err, prospect) {
    if (err) {
      return next(err);
    } else if (!prospect) {
      return res.status(404).send({
        message: 'No existe prospect con ese identificador'
      });
    }
    req.prospect = prospect;
    next();
  });
};
