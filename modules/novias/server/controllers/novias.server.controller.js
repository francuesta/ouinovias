'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Novia = mongoose.model('Novia'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a novia
 */
exports.create = function (req, res) {
  var novia = new Novia(req.body);
  novia.user = req.user;

  novia.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(novia);
    }
  });
};

/**
 * Show the current novia
 */
exports.read = function (req, res) {
  res.json(req.novia);
};

/**
 * Update a novia
 */
exports.update = function (req, res) {
  var novia = req.novia;

  novia.name = req.body.name;
  novia.surname = req.body.surname;
  novia.phone = req.body.phone;
  novia.email = req.body.email;
  novia.weddingDate = req.body.weddingDate;
  novia.weddingHour = req.body.weddingHour;
  novia.weddingPlace = req.body.weddingPlace;
  novia.weddingComments = req.body.weddingComments;
  novia.howKnowUs = req.body.howKnowUs;
  novia.facebookUser = req.body.facebookUser;
  novia.instagramUser = req.body.instagramUser;
  novia.testDate = req.body.testDate;
  novia.testHour = req.body.testHour;
  novia.testPlace = req.body.testPlace;
  novia.testComments = req.body.testComments;
  novia.professional = req.body.professional;

  novia.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(novia);
    }
  });
};

/**
 * Delete an novia
 */
exports.delete = function (req, res) {
  var novia = req.novia;

  novia.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(novia);
    }
  });
};

/**
 * List of Novias
 */
exports.list = function (req, res) {
  Novia.find().sort('-created').populate('user', 'displayName').exec(function (err, novias) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(novias);
    }
  });
};

/**
 * Novia middleware
 */
exports.noviaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Novia is invalid'
    });
  }

  Novia.findById(id).populate('user', 'displayName').exec(function (err, novia) {
    if (err) {
      return next(err);
    } else if (!novia) {
      return res.status(404).send({
        message: 'No existe novia con ese identificador'
      });
    }
    req.novia = novia;
    next();
  });
};
