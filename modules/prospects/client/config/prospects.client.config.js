'use strict';

// Configuring the Prospects module
angular.module('prospects').run(['Menus',
  function (Menus) {
    // Add the prospects dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Prospects',
      state: 'prospects',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'prospects', {
      title: 'Listado',
      state: 'prospects.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'prospects', {
      title: 'Alta',
      state: 'prospects.create',
      roles: ['user']
    });
  }
]);
