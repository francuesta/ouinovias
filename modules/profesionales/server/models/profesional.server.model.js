'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profesional Schema
 */
var ProfesionalSchema = new Schema({
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
    trim: true,
    required: 'Apellido es obligatorio'
  },
  phone: {
    type: Number,
    default: '',
    trim: true,
    required: 'Teléfono es obligatorio'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email es obligatorio'
  },
  facebookUser: {
    type: String,
    default: '',
    trim: true
  },
  instagramUser: {
    type: String,
    default: '',
    trim: true
  },
  comments: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Profesional', ProfesionalSchema);
