'use strict';

// Configuring the Profesionales module
angular.module('profesionales').run(['Menus',
  function (Menus) {
    // Add the profesionales dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Profesionales',
      state: 'profesionales',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'profesionales', {
      title: 'Listado',
      state: 'profesionales.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'profesionales', {
      title: 'Alta',
      state: 'profesionales.create',
      roles: ['user']
    });
  }
]);
