'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Price = mongoose.model('Price'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a price
 */
exports.create = function (req, res) {
  var price = new Price(req.body);
  price.user = req.user;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * Show the current price
 */
exports.read = function (req, res) {
  res.json(req.price);
};

/**
 * Update a price
 */
exports.update = function (req, res) {
  var price = req.price;

  price.year = req.body.year;
  price.discount = req.body.discount;
  price.professional = req.body.professional;
  price.services = req.body.services;

  price.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * Delete an price
 */
exports.delete = function (req, res) {
  var price = req.price;

  price.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(price);
    }
  });
};

/**
 * List of Prices
 */
exports.list = function (req, res) {
  Price.find().sort('-created').populate('user', 'displayName').exec(function (err, prices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(prices);
    }
  });
};

/**
 * Price middleware
 */
exports.priceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Price is invalid'
    });
  }

  Price.findById(id).populate('user', 'displayName').exec(function (err, price) {
    if (err) {
      return next(err);
    } else if (!price) {
      return res.status(404).send({
        message: 'No existe price con ese identificador'
      });
    }
    req.price = price;
    next();
  });
};
