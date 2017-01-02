'use strict';

// Setting up route
angular.module('prices').config(['$stateProvider',
  function ($stateProvider) {
    // Prices state routing
    $stateProvider
      .state('prices', {
        abstract: true,
        url: '/prices',
        template: '<ui-view/>'
      })
      .state('prices.list', {
        url: '',
        templateUrl: 'modules/prices/client/views/list-prices.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('prices.create', {
        url: '/create',
        templateUrl: 'modules/prices/client/views/create-price.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('prices.view', {
        url: '/:priceId',
        templateUrl: 'modules/prices/client/views/view-price.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('prices.edit', {
        url: '/:priceId/edit',
        templateUrl: 'modules/prices/client/views/edit-price.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
