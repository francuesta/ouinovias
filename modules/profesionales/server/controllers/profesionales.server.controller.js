'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profesional = mongoose.model('Profesional'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a profesional
 */
exports.create = function (req, res) {
  var profesional = new Profesional(req.body);
  profesional.user = req.user;

  profesional.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profesional);
    }
  });
};

/**
 * Show the current profesional
 */
exports.read = function (req, res) {
  res.json(req.profesional);
};

/**
 * Update a profesional
 */
exports.update = function (req, res) {
  var profesional = req.profesional;

  //TODO

  profesional.name = req.body.name;
  profesional.surname = req.body.surname;
  profesional.phone = req.body.phone;
  profesional.email = req.body.email;
  profesional.facebookUser = req.body.facebookUser;
  profesional.instagramUser = req.body.instagramUser;
  profesional.comments = req.body.comments;

  profesional.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profesional);
    }
  });
};

/**
 * Delete an profesional
 */
exports.delete = function (req, res) {
  var profesional = req.profesional;

  profesional.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profesional);
    }
  });
};

/**
 * List of Profesionales
 */
exports.list = function (req, res) {
  Profesional.find().sort('-created').populate('user', 'displayName').exec(function (err, profesionales) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profesionales);
    }
  });
};

/**
 * Profesional middleware
 */
exports.profesionalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profesional is invalid'
    });
  }

  Profesional.findById(id).populate('user', 'displayName').exec(function (err, profesional) {
    if (err) {
      return next(err);
    } else if (!profesional) {
      return res.status(404).send({
        message: 'No existe profesional con ese identificador'
      });
    }
    req.profesional = profesional;
    next();
  });
};
