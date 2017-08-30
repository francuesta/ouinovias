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
        weddingComments: this.weddingComments,
        billingDate: this.billingDate
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
        $scope.billingDate = '';
        $scope.billingDateDt = '';
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
        $scope.prospect.billingDateDt = new Date($scope.prospect.billingDate);
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
        $scope.billingDate = '';
        $scope.billingDateDt = '';
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
