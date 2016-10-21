'use strict';

// Configuring the Admin module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Gestión de Usuarios',
      state: 'admin.users'
    });
  }
]);
