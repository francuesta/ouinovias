'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Novia Schema
 */
var NoviaSchema = new Schema({
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
    type: Date,
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
  howKnowUs: {
    type: String,
    default: '',
    trim: true
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
  testDate: {
    type: Date
  },
  testHour: {
    type: String,
    trim: true
  },
  testPlace: {
    type: String,
    default: '',
    trim: true
  },
  testComments: {
    type: String,
    default: '',
    trim: true
  },
  professional: {
    type : Schema.ObjectId, 
    ref : 'Profesional'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});



mongoose.model('Novia', NoviaSchema);
