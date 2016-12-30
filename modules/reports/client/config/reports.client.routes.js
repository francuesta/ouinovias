'use strict';

// Setting up route
angular.module('reports').config(['$stateProvider',
  function ($stateProvider) {
    // Reports state routing
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.list', {
        url: '',
        templateUrl: 'modules/reports/client/views/list-reports.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
