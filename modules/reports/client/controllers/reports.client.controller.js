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
        return desc ? ~~(a[key] - b[key]) : ~~(b[key] - a[key]);
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
