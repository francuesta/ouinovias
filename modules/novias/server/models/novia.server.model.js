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
    type: Date
  },
  weddingHour: {
    type: String
  },
  weddingCitation: {
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
  price: {
    type: Schema.ObjectId,
    ref : 'Price'
  },
  services: [
    {
      seq: Number,
      quantity: Number,
      professional: {
        type : Schema.ObjectId, 
        ref : 'Profesional'
      }
    }
  ],
  displacement: {
    type: Number,
    default: 0
  },
  testDisplacement: {
    type: Number,
    default: 0
  },
  photos: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});



mongoose.model('Novia', NoviaSchema);
