'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('novias');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('prices');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('profesionales');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('prospects');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('reports');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('services');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Configuring the Novias module
angular.module('novias').run(['Menus',
  function (Menus) {
    // Add the novias dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Novias',
      state: 'novias',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'novias', {
      title: 'Listado',
      state: 'novias.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'novias', {
      title: 'Alta',
      state: 'novias.create',
      roles: ['user']
    });
  }
]);

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
        templateUrl: 'modules/novias/client/views/list-novias.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
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
        templateUrl: 'modules/novias/client/views/edit-novia.client.view.html'
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

'use strict';

// Novias controller
angular.module('novias').controller('NoviasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Novias', 'Profesionales', 'Services', 'Prices',
  function ($scope, $stateParams, $location, Authentication, Novias, Profesionales, Services, Prices) {
    var setPriceDetails = function(price, professionals, services) {
      // Professional
      if (price.professional !== undefined) {
        var profId = price.professional;
        for (var p=0; p<professionals.length; p++) {
          if (profId === professionals[p]._id) {
            price.professional = professionals[p];
          }
        }
      }
      // Services
      for (var s=0; s<price.services.length; s++) {
        var srvSeq = price.services[s].seq;
        for (var t=0; t<services.length; t++) {
          if (srvSeq === services[t].seq) {
            price.services[s].data = services[t];
          }
        }
      }
    };

    $scope.authentication = Authentication;
    if ($scope.authentication.user) {
      Profesionales.query({},function(results) {
        $scope.profesionales = results;
        Services.query({},function(resultsServices) {
          $scope.services = resultsServices;
          Prices.query({}, function(resultsPrices) {
            // Loop over prices to fill services and professional
            for (var i=0; i<resultsPrices.length; i++) {
              setPriceDetails(resultsPrices[i], $scope.profesionales, $scope.services);
            }
            $scope.prices = resultsPrices;
          });
        });
      });
    }

    var setFlags = function(novia) {
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var now = new Date();
      var diffWeddingDays = Math.ceil((new Date(novia.weddingDate).getTime() - now.getTime())/(oneDay));
      var diffTestDays = Math.ceil((new Date(novia.testDate).getTime() - now.getTime())/(oneDay));
      if (diffTestDays > 0 && diffTestDays < 15) {
        novia.imminentTest = true;
      } else {
        novia.imminentTest = false;
      }
      if (diffWeddingDays > 0 && diffWeddingDays < 15) {
        novia.imminentWedding = true;
      } else {
        novia.imminentWedding = false;
      }
    };

    var setDates = function(novia) {
      var days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
      var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      if (novia.testDate !== undefined) {
        var testDate = new Date(novia.testDate);
        var dayOfWeek = testDate.getDay();
        var month = testDate.getMonth();
        novia.testDateText = days[dayOfWeek] + ', ' + testDate.getDate() + ' de ' + months[month] + ' de ' + testDate.getFullYear();
      }
      if (novia.weddingDate !== undefined) {
        var weddingDate = new Date(novia.weddingDate);
        var weddingDayOfWeek = weddingDate.getDay();
        var weddingMonth = weddingDate.getMonth();
        novia.weddingDateText = days[weddingDayOfWeek] + ', ' + weddingDate.getDate() + ' de ' + months[weddingMonth] + ' de ' + weddingDate.getFullYear();
      }
    };

    // Create new Novia
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'noviaForm');

        return false;
      }

      // Create new Novia object
      var novia = new Novias({
        name: this.name,
        surname: this.surname,
        phone: this.phone,
        email: this.email,
        weddingDate: this.weddingDate,
        weddingHour: this.weddingHour,
        weddingCitation: this.weddingCitation,
        weddingPlace: this.weddingPlace,
        weddingComments: this.weddingComments,
        howKnowUs: this.howKnowUs,
        facebookUser: this.facebookUser,
        instagramUser: this.instagramUser,
        testDate: this.testDate,
        testHour: this.testHour,
        testPlace: this.testPlace,
        testComments: this.testComments,
        professional: this.professional,
        price: this.price,
        services: [{ 'seq':1,'quantity':1 }],
        displacement: this.displacement
      });

      // Redirect after save
      novia.$save(function (response) {
        $location.path('novias/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.surname = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.weddingDate = '';
        $scope.weddingDateDt = '';
        $scope.weddingHour = '';
        $scope.weddingCitation = '';
        $scope.weddingPlace = '';
        $scope.weddingComments = '';
        $scope.howKnowUs = '';
        $scope.facebookUser = '';
        $scope.instagramUser = '';
        $scope.testDate = '';
        $scope.testDateDt = '';
        $scope.testHour = '';
        $scope.testPlace = '';
        $scope.testComments = '';
        $scope.professional = '';
        $scope.price = '';
        $scope.displacement = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Novia
    $scope.remove = function (novia) {
      if (novia) {
        novia.$remove();

        for (var i in $scope.novias) {
          if ($scope.novias[i] === novia) {
            $scope.novias.splice(i, 1);
          }
        }
      } else {
        $scope.novia.$remove(function () {
          $location.path('novias');
        });
      }
    };

    // Update existing Novia
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'noviaForm');

        return false;
      }

      var novia = $scope.novia;

      novia.$update(function () {
        $location.path('novias/' + novia._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    var setPrice = function(novia) {
      var weddingDate = novia.weddingDateDt;
      var professionalId = novia.professional;
      if (weddingDate !== undefined) {
        var year = weddingDate.getFullYear();
        // Search prices for professional
        var priceForProfessionalAndYear;
        var priceForYear;
        for (var i=0; i<$scope.prices.length; i++) {
          if (year === $scope.prices[i].year && $scope.prices[i].professional === undefined && $scope.prices[i].discount === undefined) {
            priceForYear = $scope.prices[i];
          }
          if (year === $scope.prices[i].year && $scope.prices[i].professional !== undefined && $scope.prices[i].professional._id === professionalId && $scope.prices[i].discount === undefined) {
            priceForProfessionalAndYear = $scope.prices[i];
          }
        }
        if (priceForProfessionalAndYear !== undefined) {
          novia.price = priceForProfessionalAndYear._id;
          novia.selectedPrice = priceForProfessionalAndYear;
        } else if (priceForYear) {
          novia.price = priceForYear._id;
          novia.selectedPrice = priceForYear;
        }
        console.log('Price: ' + $scope.novia.selectedPrice.year);
      }
    };

    $scope.changeWeddingDate = function() {
      this.weddingDate = this.weddingDateDt.toISOString();
      setPrice(this);
    };

    $scope.changeProfessional = function() {
      setPrice(this);
    };

    // Update wedding date from edit page
    $scope.updateWeddingDate = function() {
      $scope.novia.weddingDate = $scope.novia.weddingDateDt.toISOString();
      setPrice($scope.novia);
    };

    // Update selected Professional
    $scope.updateProfessional = function() {
      $scope.novia.professional = $scope.novia.selectedProfessional._id;
      setPrice($scope.novia);
    };

    // Update selected Price
    $scope.updatePrice = function() {
      $scope.novia.price = $scope.novia.selectedPrice._id;
      console.log('Price: ' + $scope.novia.selectedPrice.year);
    };

    // Add new service
    $scope.addNewService = function() {
      $scope.novia.services.push({ 'quantity':1, 'seq':0 });
    };

    // Remov last service
    $scope.removeService = function() {
      $scope.novia.services.pop();
    };

    // Find a list of Novias
    $scope.find = function () {
      Novias.query({}, function(results) {
        $scope.noviasFull = results;
        // Loop over array to search next events
        for (var i=0; i<$scope.noviasFull.length; i++) {
          setFlags($scope.noviasFull[i]);
        }
        $scope.novias = $scope.noviasFull;
      });
    };

    // Filter a list of Novias
    $scope.filter = function() {
      var all = [];
      // Loop over all
      for (var i=0; i<$scope.noviasFull.length; i++) {
        var name = $scope.noviasFull[i].name + ' ' + $scope.noviasFull[i].surname;
        name = name.toUpperCase();
        var toSearch = $scope.search.toUpperCase();
        if ($scope.search === '' || name.indexOf(toSearch) !== -1) {
          all.push($scope.noviasFull[i]);
        }
      }
      $scope.novias = all;
    };

    // Find existing Novia
    $scope.findOne = function () {
      $scope.novia = Novias.get({
        noviaId: $stateParams.noviaId
      }, function() {
        $scope.novia.weddingDateDt = new Date($scope.novia.weddingDate);
        $scope.novia.testDateDt = new Date($scope.novia.testDate);
        setFlags($scope.novia);
        setDates($scope.novia);
        if ($scope.authentication.user) {
          Profesionales.query({},function(results) {
            for (var i=0; i<results.length; i++) {
              if (results[i]._id === $scope.novia.professional) {
                $scope.novia.professionalText = results[i].name + ' ' + results[i].surname;
                $scope.novia.selectedProfessional = results[i];
              }
            }
            // Look for services for this novia
            for (var s=0; s<$scope.novia.services.length; s++) {
              var prfId = $scope.novia.services[s].professional;
              if (prfId === undefined) {
                prfId = $scope.novia.professional;
              }
              if (prfId !== undefined) {
                for (var m=0; m<results.length; m++) {
                  if (results[m]._id === prfId) {
                    $scope.novia.services[s].professionalText = results[m].name + ' ' + results[m].surname;
                  }
                }
              } else {
                $scope.novia.services[s].professionalText = 'Profesional NO definido aún';
              }
            }
            $scope.profesionales = results;
          });
          Services.query({},function(resultsServices) {
            $scope.services = resultsServices;
            // Look for services for this novia
            for (var s=0; s<$scope.novia.services.length; s++) {
              var srvSeq = $scope.novia.services[s].seq;
              for (var t=0; t<resultsServices.length; t++) {
                if (resultsServices[t].seq === srvSeq) {
                  $scope.novia.services[s].data = resultsServices[t];
                }
              }
            }
            Prices.query({}, function(resultsPrices) {
              // Loop over prices to fill services and professional
              for (var p=0; p<resultsPrices.length; p++) {
                setPriceDetails(resultsPrices[p], $scope.profesionales, $scope.services);
                if (resultsPrices[p]._id === $scope.novia.price) {
                  $scope.novia.priceText = resultsPrices[p].year;
                  if (resultsPrices[p].professional !== undefined) {
                    $scope.novia.priceText = $scope.novia.priceText + ' ' + resultsPrices[p].professional.name + ' ' + resultsPrices[p].professional.surname;
                  }
                  if (resultsPrices[p].discount !== undefined) {
                    $scope.novia.priceText = $scope.novia.priceText + ' (Descuento ' + resultsPrices[p].discount + ')';
                  }
                  $scope.novia.selectedPrice = resultsPrices[p];
                }
              }
              $scope.prices = resultsPrices;
              // Calculate totals
              var total = 0;
              for (var z=0; z<$scope.novia.services.length; z++) {
                var quantity = $scope.novia.services[z].quantity;
                var tmpSeq = $scope.novia.services[z].seq;
                var price = 0;
                for (var w=0; w<$scope.novia.selectedPrice.services.length; w++) {
                  if ($scope.novia.selectedPrice.services[w].seq === tmpSeq) {
                    price = $scope.novia.selectedPrice.services[w].price;
                  }
                }
                total = total + (price*quantity);
              }
              $scope.novia.total = total;
              $scope.novia.reservation = total/3;
              $scope.novia.testPrice = total/3;
              $scope.novia.weddingPrice = total/3;
            });
          });
        }
      });
    };
  }
]);

'use strict';

//Novias service used for communicating with the novias REST endpoints
angular.module('novias').factory('Novias', ['$resource',
  function ($resource) {
    return $resource('api/novias/:noviaId', {
      noviaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

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

'use strict';

// Prices controller
angular.module('prices').controller('PricesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Prices', 'Profesionales', 'Services',
  function ($scope, $stateParams, $location, Authentication, Prices, Profesionales, Services) {
    $scope.authentication = Authentication;
    Profesionales.query({},function(results) {
      $scope.profesionales = results;
      Services.query({}, function(services) {
        $scope.services = services;
      });
    });

    // Create new Price
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'priceForm');
        return false;
      }

      var services = [];

      for (var i=0; i<$scope.services.length; i++) {
        var service = { 'seq': $scope.services[i].seq, 'price': $scope.services[i].price };
        services.push(service);
      }

      // Create new Price object
      var price = new Prices({
        year: this.year,
        professional: this.professional,
        discount: this.discount,
        services: services
      });

      // Redirect after save
      price.$save(function (response) {
        $location.path('prices/' + response._id);

        // Clear form fields
        $scope.year = '';
        $scope.professional = '';
        $scope.discount = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Price
    $scope.remove = function (price) {
      if (price) {
        price.$remove();

        for (var i in $scope.prices) {
          if ($scope.prices[i] === price) {
            $scope.prices.splice(i, 1);
          }
        }
      } else {
        $scope.price.$remove(function () {
          $location.path('prices');
        });
      }
    };

    // Update existing Price
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'priceForm');

        return false;
      }

      var price = $scope.price;

      price.$update(function () {
        $location.path('prices/' + price._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Prices
    $scope.find = function () {
      $scope.prices = Prices.query({}, function(prices) {
        Profesionales.query({},function(results) {
          // Search professional
          for (var i=0; i<prices.length; i++) {
            if (prices[i].professional) {
              for(var k=0; k<results.length; k++) {
                if (prices[i].professional === results[k]._id) {
                  prices[i].professional = results[k];
                }
              }
            }
          }
        });
      });

    };

    // Find existing Price
    $scope.findOne = function () {
      $scope.price = Prices.get({
        priceId: $stateParams.priceId
      }, function() {
        Services.query({}, function(services) {
          // Search services
          for (var i=0; i<$scope.price.services.length; i++) {
            for (var j=0; j<services.length; j++) {
              if ($scope.price.services[i].seq === services[j].seq) {
                $scope.price.services[i].name = services[j].name;
              }
            }
          }
          // Search professional
          if ($scope.price.professional) {
            Profesionales.query({},function(results) {
              for(var k=0; k<results.length; k++) {
                if ($scope.price.professional === results[k]._id) {
                  $scope.price.professional = results[k];
                }
              }
            });
          }
        });
      });
    };
  }
]);

'use strict';

//Prices price used for communicating with the prices REST endpoints
angular.module('prices').factory('Prices', ['$resource',
  function ($resource) {
    return $resource('api/prices/:priceId', {
      priceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Profesionales module
angular.module('profesionales').run(['Menus',
  function (Menus) {
    // Add the profesionales dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Profesionales',
      state: 'profesionales',
      type: 'dropdown',
      roles: ['user','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'profesionales', {
      title: 'Listado',
      state: 'profesionales.list',
      roles: ['user','admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'profesionales', {
      title: 'Alta',
      state: 'profesionales.create',
      roles: ['user','admin']
    });
  }
]);

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
        templateUrl: 'modules/profesionales/client/views/list-profesionales.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
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
        templateUrl: 'modules/profesionales/client/views/view-profesional.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
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

'use strict';

// Profesionales controller
angular.module('profesionales').controller('ProfesionalesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profesionales',
  function ($scope, $stateParams, $location, Authentication, Profesionales) {
    $scope.authentication = Authentication;

    // Create new Profesional
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profesionalForm');

        return false;
      }

      // Create new Profesional object
      var profesional = new Profesionales({
        name: this.name,
        surname: this.surname,
        phone: this.phone,
        email: this.email,
        facebookUser: this.facebookUser,
        instagramUser: this.instagramUser,
        comments: this.comments
      });

      // Redirect after save
      profesional.$save(function (response) {
        $location.path('profesionales/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.surname = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.facebookUser = '';
        $scope.instagramUser = '';
        $scope.comments = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Profesional
    $scope.remove = function (profesional) {
      if (profesional) {
        profesional.$remove();

        for (var i in $scope.profesionales) {
          if ($scope.profesionales[i] === profesional) {
            $scope.profesionales.splice(i, 1);
          }
        }
      } else {
        $scope.profesional.$remove(function () {
          $location.path('profesionales');
        });
      }
    };

    // Update existing Profesional
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profesionalForm');

        return false;
      }

      var profesional = $scope.profesional;

      profesional.$update(function () {
        $location.path('profesionales/' + profesional._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Profesionales
    $scope.find = function () {
      $scope.profesionalesFull = Profesionales.query();
      $scope.profesionales = $scope.profesionalesFull;
    };

    // Filter a list of Profesionales
    $scope.filter = function() {
      var all = [];
      // Loop over all
      for (var i=0; i<$scope.profesionalesFull.length; i++) {
        var name = $scope.profesionalesFull[i].name + ' ' + $scope.profesionalesFull[i].surname;
        name = name.toUpperCase();
        var toSearch = $scope.search.toUpperCase();
        if ($scope.search === '' || name.indexOf(toSearch) !== -1) {
          all.push($scope.profesionalesFull[i]);
        }
      }
      $scope.profesionales = all;
    };

    // Find existing Profesional
    $scope.findOne = function () {
      $scope.profesional = Profesionales.get({
        profesionalId: $stateParams.profesionalId
      });
    };
  }
]);

'use strict';

//Profesionales service used for communicating with the profesionales REST endpoints
angular.module('profesionales').factory('Profesionales', ['$resource',
  function ($resource) {
    return $resource('api/profesionales/:profesionalId', {
      profesionalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Prospects module
angular.module('prospects').run(['Menus',
  function (Menus) {
    // Add the prospects dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Prospects',
      state: 'prospects',
      type: 'dropdown',
      roles: ['user','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'prospects', {
      title: 'Listado',
      state: 'prospects.list',
      roles: ['user','admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'prospects', {
      title: 'Alta',
      state: 'prospects.create',
      roles: ['user','admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('prospects').config(['$stateProvider',
  function ($stateProvider) {
    // Prospects state routing
    $stateProvider
      .state('prospects', {
        abstract: true,
        url: '/prospects',
        template: '<ui-view/>'
      })
      .state('prospects.list', {
        url: '',
        templateUrl: 'modules/prospects/client/views/list-prospects.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('prospects.create', {
        url: '/create',
        templateUrl: 'modules/prospects/client/views/create-prospect.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('prospects.view', {
        url: '/:prospectId',
        templateUrl: 'modules/prospects/client/views/view-prospect.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('prospects.edit', {
        url: '/:prospectId/edit',
        templateUrl: 'modules/prospects/client/views/edit-prospect.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Prospects controller
angular.module('prospects').controller('ProspectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Prospects', 'Novias',
  function ($scope, $stateParams, $location, Authentication, Prospects, Novias) {
    $scope.authentication = Authentication;

    // Create new Prospect
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'prospectForm');

        return false;
      }

      // Create new Prospect object
      var prospect = new Prospects({
        name: this.name,
        surname: this.surname,
        phone: this.phone,
        email: this.email,
        weddingDate: this.weddingDate,
        weddingHour: this.weddingHour,
        weddingPlace: this.weddingPlace,
        weddingComments: this.weddingComments
      });

      // Redirect after save
      prospect.$save(function (response) {
        $location.path('prospects/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.surname = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.weddingDate = '';
        $scope.weddingDateDt = '';
        $scope.weddingHour = '';
        $scope.weddingPlace = '';
        $scope.weddingComments = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Prospect
    $scope.remove = function (prospect) {
      if (prospect) {
        prospect.$remove();

        for (var i in $scope.prospects) {
          if ($scope.prospects[i] === prospect) {
            $scope.prospects.splice(i, 1);
          }
        }
      } else {
        $scope.prospect.$remove(function () {
          $location.path('prospects');
        });
      }
    };

    // Update existing Prospect
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'prospectForm');

        return false;
      }

      var prospect = $scope.prospect;

      prospect.$update(function () {
        $location.path('prospects/' + prospect._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Prospects
    $scope.find = function () {
      $scope.prospectsFull = Prospects.query();
      $scope.prospects = $scope.prospectsFull;
    };

    // Filter a list of Prospects
    $scope.filter = function() {
      var all = [];
      // Loop over all
      for (var i=0; i<$scope.prospectsFull.length; i++) {
        var name = $scope.prospectsFull[i].name + ' ' + $scope.prospectsFull[i].surname;
        name = name.toUpperCase();
        var toSearch = $scope.search.toUpperCase();
        if ($scope.search === '' || name.indexOf(toSearch) !== -1) {
          all.push($scope.prospectsFull[i]);
        }
      }
      $scope.prospects = all;
    };

    // Find existing Prospect
    $scope.findOne = function () {
      $scope.prospect = Prospects.get({
        prospectId: $stateParams.prospectId
      }, function() {
        $scope.prospect.weddingDateDt = new Date($scope.prospect.weddingDate);
      });
    };

    // Convert prospect to novia
    $scope.convert = function(prospect) {
      $scope.error = null;

      // Create new Novia object
      var novia = new Novias({
        name: prospect.name,
        surname: prospect.surname,
        phone: prospect.phone,
        email: prospect.email,
        weddingDate: prospect.weddingDate,
        weddingHour: prospect.weddingHour,
        weddingPlace: prospect.weddingPlace,
        weddingComments: prospect.weddingComments,
        // Default - One pack
        services: [{ 'seq':1,'quantity':1 }]
      });

      // Redirect after save
      novia.$save(function (response) {
        // Clear form fields
        $scope.name = '';
        $scope.surname = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.weddingDate = '';
        $scope.weddingDateDt = '';
        $scope.weddingHour = '';
        $scope.weddingPlace = '';
        $scope.weddingComments = '';
        // Update prospect reference
        prospect.bride = response._id;
        prospect.$update(function () {
          // Redirect to bride page
          $location.path('novias/' + response._id + '/edit');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

//Prospects service used for communicating with the prospects REST endpoints
angular.module('prospects').factory('Prospects', ['$resource',
  function ($resource) {
    return $resource('api/prospects/:prospectId', {
      prospectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

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
      title: 'Año y mes',
      state: 'reports.year',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Profesional y año',
      state: 'reports.prof',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('reports').config(['$stateProvider',
  function ($stateProvider) {
    // Reports state routing
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.year', {
        url: '/years',
        templateUrl: 'modules/reports/client/views/list-reports-year.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('reports.prof', {
        url: '/professionals',
        templateUrl: 'modules/reports/client/views/list-reports-prof.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Prospects controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profesionales', 'Novias', 'Services',
  function ($scope, $stateParams, $location, Authentication, Professionals, Brides, Servicios) {
    $scope.authentication = Authentication;

    var textMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var _searchById = function(id, array) {
      for (var index=0; index<array.length; index++) {
        if (array[index].id === id) {
          return array[index];
        }
      }
      return null;
    };

    var _searchServiceText = function(id) {
      for (var index=0; index<$scope.services.length; index++) {
        if ($scope.services[index].seq === id) {
          return $scope.services[index].name;
        }
      }
      return 'Servicio no encontrado?';
    };

    var _sortByKey = function(key,desc) {
      return function(a,b){
        return desc ? ~~(b[key] - a[key]) : ~~(a[key] - b[key]);
      };
    };

    var _addBrideToObj = function(bride, obj) {
      // Add one bride
      obj.brides = obj.brides+1;
      // Loop over bride services
      for (var i=0; i<bride.services.length; i++) {
        if (bride.services[i].quantity > 0) {
          // Check if service exists
          var service = _searchById(bride.services[i].seq, obj.services);
          if (service === null) {
            // Create service if not exists
            service = { 'id': bride.services[i].seq, 'text': _searchServiceText(bride.services[i].seq), 'number': 0 };
            obj.services.push(service);
          }
          // Increase number of services
          service.number = service.number + bride.services[i].quantity;
        }
      }
    };

    var _addBrideToYear = function(bride, reportsByYearAndMonth) {
      // Get bride year
      if (bride.weddingDate) {
        var year = new Date(bride.weddingDate).getFullYear();
        var month = new Date(bride.weddingDate).getMonth()+1;
        // Search for year
        var yearObj = _searchById(year, reportsByYearAndMonth);
        // Create year if not exists
        if (yearObj === null) {
          yearObj = { 'id': year, 'brides': 0, 'months': [], 'services': [] };
          reportsByYearAndMonth.push(yearObj);
        }
        _addBrideToObj(bride, yearObj);
        // Search for month in year
        var monthObj = _searchById(month, yearObj.months);
        // Create month if not exists
        if (monthObj === null) {
          monthObj = { 'id': month, 'text': textMonths[month-1], 'brides': 0, 'services': [] };
          yearObj.months.push(monthObj);
        }
        _addBrideToObj(bride, monthObj);
      }
    };

    var _createReportByYear = function() {
      var reportsByYearAndMonth = [];
      // Loop over brides
      for (var k=0; k<$scope.brides.length; k++) {
        _addBrideToYear($scope.brides[k], reportsByYearAndMonth);
      }
      // Sort results
      reportsByYearAndMonth.sort(_sortByKey('id'));
      for (var i=0; i<reportsByYearAndMonth.length; i++) {
        reportsByYearAndMonth[i].months.sort(_sortByKey('id'));
      }
      var allReports = { 'byYearAndMonth': reportsByYearAndMonth };
      $scope.reports = allReports;
    };

    var _searchProfessionalText = function(id) {
      for (var index=0; index<$scope.professionals.length; index++) {
        if ($scope.professionals[index]._id === id) {
          return $scope.professionals[index].name + ' ' + $scope.professionals[index].surname;
        }
      }
      return 'Profesional no encontrado?';
    };

    var _addBrideToProfessional = function(bride, reportsByProfessionalAndYear) {
      // Get bride year and professional
      if (bride.weddingDate && bride.professional) {
        var year = new Date(bride.weddingDate).getFullYear();
        var brideProfId = bride.professional;
        // Loop over services
        for (var i=0; i<bride.services.length; i++) {
          var serviceProfId = bride.professional;
          if (bride.services[i].professional) {
            serviceProfId = bride.services[i].professional;
          }
          var tmpBride = { 'services': [bride.services[i]] };
          // Search for professional
          var profObj = _searchById(serviceProfId, reportsByProfessionalAndYear);
          // Create professional if not exists
          if (profObj === null) {
            profObj = { 'id': serviceProfId, 'text': _searchProfessionalText(serviceProfId), 'years': [], 'brides': 0, 'services': [] };
            reportsByProfessionalAndYear.push(profObj);
          }
          _addBrideToObj(tmpBride, profObj);
          // Search for year in professional
          var yearObj = _searchById(year, profObj.years);
          // Create year if not exists
          if (yearObj === null) {
            yearObj = { 'id': year, 'brides': 0, 'services': [] };
            profObj.years.push(yearObj);
          }
          _addBrideToObj(tmpBride, yearObj);
        } 
      }
    };

    var _createReportByProf = function() {
      var reportsByProfessionalAndYear = [];
      // Loop over brides
      for (var k=0; k<$scope.brides.length; k++) {
        _addBrideToProfessional($scope.brides[k], reportsByProfessionalAndYear);
      }
      // Sort results
      for (var i=0; i<reportsByProfessionalAndYear.length; i++) {
        reportsByProfessionalAndYear[i].years.sort(_sortByKey('id'));
      }
      var allReports = { 'byProfessionalAndYear': reportsByProfessionalAndYear };
      $scope.reports = allReports;
    };

    // Find a list of Prospects
    $scope.findYear = function () {
      // Load brides information
      Brides.query({}, function(results) {
        $scope.brides = results;
        // Load Services information
        Servicios.query({}, function(results) {
          $scope.services = results;
          _createReportByYear();
        });
      });
    };

    // Find a list of Prospects
    $scope.findProf = function () {
      // Load brides information
      Brides.query({}, function(results) {
        $scope.brides = results;
        // Load professionals information
        Professionals.query({},function(results) {
          $scope.professionals = results;
          Servicios.query({}, function(results) {
            $scope.services = results;
            _createReportByProf();
          });
        });
      });
    };

  }
]);

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

'use strict';

// Services controller
angular.module('services').controller('ServicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Services',
  function ($scope, $stateParams, $location, Authentication, Services) {
    $scope.authentication = Authentication;

    // Create new Service
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'serviceForm');

        return false;
      }

      // Create new Service object
      var service = new Services({
        seq: this.seq,
        name: this.name
      });

      // Redirect after save
      service.$save(function (response) {
        $location.path('services/' + response._id);

        // Clear form fields
        $scope.seq = '';
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Service
    $scope.remove = function (service) {
      if (service) {
        service.$remove();

        for (var i in $scope.services) {
          if ($scope.services[i] === service) {
            $scope.services.splice(i, 1);
          }
        }
      } else {
        $scope.service.$remove(function () {
          $location.path('services');
        });
      }
    };

    // Update existing Service
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'serviceForm');

        return false;
      }

      var service = $scope.service;

      service.$update(function () {
        $location.path('services/' + service._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Services
    $scope.find = function () {
      $scope.services = Services.query();
    };

    // Find existing Service
    $scope.findOne = function () {
      $scope.service = Services.get({
        serviceId: $stateParams.serviceId
      });
    };
  }
]);

'use strict';

//Services service used for communicating with the services REST endpoints
angular.module('services').factory('Services', ['$resource',
  function ($resource) {
    return $resource('api/services/:serviceId', {
      serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

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

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
