'use strict';

//Prospects service used for communicating with the prospects REST endpoints
angular.module('prospects').factory('Prospects', ['$resource',
  function ($resource) {
    return $resource('api/prospects/:prospectId', {
      prospectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
