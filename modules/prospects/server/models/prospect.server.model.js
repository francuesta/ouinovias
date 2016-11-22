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
  weddingDate: {
    type: String,
    required: 'Fecha de la boda obligatoria'
  },
  weddingHour: {
    type: String,
    required: 'Hora de la boda obligatoria'
  },
  weddingPlace: {
    type: String,
    default: '',
    trim: true,
    required: 'Lugar de la boda obligatorio'
  },
  weddingComments: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});



mongoose.model('Prospect', ProspectSchema);
