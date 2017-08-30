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
      .state('reports.year', {
        url: '/years',
        templateUrl: 'modules/reports/client/views/list-reports-year.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('reports.prof', {
        url: '/professionals',
        templateUrl: 'modules/reports/client/views/list-reports-prof.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
