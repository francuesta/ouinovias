'use strict';

//Prices price used for communicating with the prices REST endpoints
angular.module('prices').factory('Prices', ['$resource',
  function ($resource) {
    return $resource('api/prices/:priceId', {
      priceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
