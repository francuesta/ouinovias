'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Service Schema
 */
var ServiceSchema = new Schema({
  seq: { 
    type: Number, 
    default: 0,
    required: 'ID es obligatorio'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Nombre es obligatorio'
  }
});



mongoose.model('Service', ServiceSchema);
