'use strict';

// Prospects controller
angular.module('prospects').controller('ProspectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Prospects',
  function ($scope, $stateParams, $location, Authentication, Prospects) {
    $scope.authentication = Authentication;

    // Create new Prospect
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'prospectForm');

        return false;
      }

      //TODO

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
  }
]);
