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
        var service = { 'seq': $scope.services[i].seq, 'price': $scope.services[i].price, 'reservation': $scope.services[i].reservation };
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
