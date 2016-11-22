'use strict';

// Setting up route
angular.module('prospects').config(['$stateProvider',
  function ($stateProvider) {
    // Prospects state routing
    $stateProvider
      .state('prospects', {
        abstract: true,
        url: '/prospects',
        template: '<ui-view/>'
      })
      .state('prospects.list', {
        url: '',
        templateUrl: 'modules/prospects/client/views/list-prospects.client.view.html'
      })
      .state('prospects.create', {
        url: '/create',
        templateUrl: 'modules/prospects/client/views/create-prospect.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('prospects.view', {
        url: '/:prospectId',
        templateUrl: 'modules/prospects/client/views/view-prospect.client.view.html'
      })
      .state('prospects.edit', {
        url: '/:prospectId/edit',
        templateUrl: 'modules/prospects/client/views/edit-prospect.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
