'use strict';

// Configuring the Novias module
angular.module('novias').run(['Menus',
  function (Menus) {
    // Add the novias dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Novias',
      state: 'novias',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'novias', {
      title: 'Listado',
      state: 'novias.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'novias', {
      title: 'Alta',
      state: 'novias.create',
      roles: ['user']
    });
  }
]);
