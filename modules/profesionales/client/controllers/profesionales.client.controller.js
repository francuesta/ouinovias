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

      //TODO

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
