'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Price Schema
 */
var PriceSchema = new Schema({
  year: {
    type: Number,
    trim: true,
    required: 'Año es obligatorio'
  },
  discount: {
    type: String,
    trim: true
  },
  professional: {
    type : Schema.ObjectId, 
    ref : 'Profesional'
  },
  services: [
    {
      seq: Number,
      price: Number
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Price', PriceSchema);
