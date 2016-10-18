'use strict';

//Novias service used for communicating with the novias REST endpoints
angular.module('novias').factory('Novias', ['$resource',
  function ($resource) {
    return $resource('api/novias/:noviaId', {
      noviaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
