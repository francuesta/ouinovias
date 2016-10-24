'use strict';

// Setting up route
angular.module('profesionales').config(['$stateProvider',
  function ($stateProvider) {
    // Profesionales state routing
    $stateProvider
      .state('profesionales', {
        abstract: true,
        url: '/profesionales',
        template: '<ui-view/>'
      })
      .state('profesionales.list', {
        url: '',
        templateUrl: 'modules/profesionales/client/views/list-profesionales.client.view.html'
      })
      .state('profesionales.create', {
        url: '/create',
        templateUrl: 'modules/profesionales/client/views/create-profesional.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('profesionales.view', {
        url: '/:profesionalId',
        templateUrl: 'modules/profesionales/client/views/view-profesional.client.view.html'
      })
      .state('profesionales.edit', {
        url: '/:profesionalId/edit',
        templateUrl: 'modules/profesionales/client/views/edit-profesional.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
