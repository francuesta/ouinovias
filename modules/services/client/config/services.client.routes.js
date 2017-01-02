'use strict';

// Setting up route
angular.module('services').config(['$stateProvider',
  function ($stateProvider) {
    // Services state routing
    $stateProvider
      .state('services', {
        abstract: true,
        url: '/services',
        template: '<ui-view/>'
      })
      .state('services.list', {
        url: '',
        templateUrl: 'modules/services/client/views/list-services.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('services.create', {
        url: '/create',
        templateUrl: 'modules/services/client/views/create-service.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('services.view', {
        url: '/:serviceId',
        templateUrl: 'modules/services/client/views/view-service.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('services.edit', {
        url: '/:serviceId/edit',
        templateUrl: 'modules/services/client/views/edit-service.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
