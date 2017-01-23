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
        if ($scope.authentication.user) {
          Profesionales.query({},function(results) {
            for (var i=0; i<results.length; i++) {
              if (results[i]._id === $scope.novia.professional) {
                $scope.novia.professionalText = results[i].name + ' ' + results[i].surname;
                $scope.novia.selectedProfessional = results[i];
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
              console.log('Price: ' + $scope.novia.selectedPrice.year);
            });
          });
        }
      });
    };
  }
]);
