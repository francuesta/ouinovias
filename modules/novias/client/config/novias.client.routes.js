'use strict';

// Setting up route
angular.module('novias').config(['$stateProvider',
  function ($stateProvider) {
    // Novias state routing
    $stateProvider
      .state('novias', {
        abstract: true,
        url: '/novias',
        template: '<ui-view/>'
      })
      .state('novias.list', {
        url: '',
        templateUrl: 'modules/novias/client/views/list-novias.client.view.html'
      })
      .state('novias.create', {
        url: '/create',
        templateUrl: 'modules/novias/client/views/create-novia.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('novias.view', {
        url: '/:noviaId',
        templateUrl: 'modules/novias/client/views/view-novia.client.view.html'
      })
      .state('novias.edit', {
        url: '/:noviaId/edit',
        templateUrl: 'modules/novias/client/views/edit-novia.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('novias.mail', {
        url: '/:noviaId/mail',
        templateUrl: 'modules/novias/client/views/mail-novia.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
