'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Prospect Schema
 */
var ProspectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Nombre es obligatorio'
  },
  surname: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: Number,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email es obligatorio'
  },
  weddingDate: {
    type: String
  },
  weddingHour: {
    type: String
  },
  weddingPlace: {
    type: String,
    default: '',
    trim: true
  },
  weddingComments: {
    type: String,
    default: '',
    trim: true
  },
  bride: {
    type: Schema.ObjectId,
    ref: 'Novia'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  billingDate: {
    type: String
  }
});



mongoose.model('Prospect', ProspectSchema);
