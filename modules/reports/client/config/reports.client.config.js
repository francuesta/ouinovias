'use strict';

// Configuring the Reports module
angular.module('reports').run(['Menus',
  function (Menus) {
    // Add the reports dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Informes',
      state: 'reports',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Por año y mes',
      state: 'reports.year',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Por profesional y año',
      state: 'reports.prof',
      roles: ['admin']
    });
  }
]);
