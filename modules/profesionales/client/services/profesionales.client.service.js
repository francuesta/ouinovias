'use strict';

//Profesionales service used for communicating with the profesionales REST endpoints
angular.module('profesionales').factory('Profesionales', ['$resource',
  function ($resource) {
    return $resource('api/profesionales/:profesionalId', {
      profesionalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
