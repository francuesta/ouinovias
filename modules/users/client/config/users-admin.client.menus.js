'use strict';

// Configuring the Admin module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Gestión de Usuarios',
      state: 'admin.users'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Crear usuario',
      state: 'authentication.signup',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Gestión de servicios',
      state: 'services.list',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Alta de servicio',
      state: 'services.create',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Gestión de precios',
      state: 'prices.list',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Alta de precio',
      state: 'prices.create',
      roles: ['admin']
    });
  }
]);
