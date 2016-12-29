'use strict';

// Novias controller
angular.module('novias').controller('NoviasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Novias', 'Profesionales',
  function ($scope, $stateParams, $location, Authentication, Novias, Profesionales) {
    $scope.authentication = Authentication;
    Profesionales.query({},function(results) {
      $scope.profesionales = results;
    });

    var setFlags = function(novia) {
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var now = new Date();
      var diffWeddingDays = Math.ceil(Math.abs((new Date(novia.weddingDate).getTime() - now.getTime())/(oneDay)));
      var diffTestDays = Math.ceil(Math.abs((new Date(novia.testDate).getTime() - now.getTime())/(oneDay)));
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
        weddingPlace: this.weddingPlace,
        weddingComments: this.weddingComments,
        howKnowUs: this.howKnowUs,
        facebookUser: this.facebookUser,
        instagramUser: this.instagramUser,
        testDate: this.testDate,
        testHour: this.testHour,
        testPlace: this.testPlace,
        testComments: this.testComments,
        professional: this.professional
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

    // Update selected Professional
    $scope.updateProfessional = function() {
      $scope.novia.professional = $scope.novia.selectedProfessional._id;
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
        Profesionales.query({},function(results) {
          for (var i=0; i<results.length; i++) {
            if (results[i]._id === $scope.novia.professional) {
              $scope.novia.professionalText = results[i].name + ' ' + results[i].surname;
              $scope.novia.selectedProfessional = results[i];
            }
          }
          $scope.profesionales = results;
        });
      });
    };
  }
]);
