'use strict';

// Prospects controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profesionales', 'Novias', 'Services',
  function ($scope, $stateParams, $location, Authentication, Profesionales, Novias, Servicios) {
    $scope.authentication = Authentication;

    var textMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var _createReportByYear = function(novias, profesionales, servicios) {
      var reportsByYearAndMonth = [];
      // Loop over novias
      for (var k=0; k<novias.length; k++) {
        _addNoviaToYear(novias[k], reportsByYearAndMonth);
      }
      // Sort results
      reportsByYearAndMonth.sort(_sortByKey('id'));
      for (var i=0; i<reportsByYearAndMonth.length; i++) {
        reportsByYearAndMonth[i].months.sort(_sortByKey('id'));
      }
      var allReports = { 'byYearAndMonth': reportsByYearAndMonth };
      $scope.reports = allReports;
    };

    var _createReportByProf = function(novias, profesionales, servicios) {
      var years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
      // Reports by professional and year
      var byProfessionalAndYear = [];
      for (var p=0; p<profesionales.length; p++) {
        var reportByProfesionalAndYear = { 'text': profesionales[p].name + ' ' + profesionales[p].surname, 'years': [], 'novias': [] };
        for (var y=0; y<years.length; y++) {
          var reportByYear = { 'year': years[y], 'novias': [] };
          // Loop over novias to check professional and year
          for (var n=0; n<novias.length; n++) {
            if (novias[n].weddingDate && novias[n].professional) {
              var tmpYear = new Date(novias[n].weddingDate).getFullYear();
              if (tmpYear === years[y] && novias[n].professional === profesionales[p]._id) {
                // Add info to year and month
                reportByProfesionalAndYear.novias.push(novias[n]);
                reportByYear.novias.push(novias[n]);
              }
            }
          }
          if (reportByYear.novias.length > 0) {
            reportByProfesionalAndYear.years.push(reportByYear);
          }
        }
        if (reportByProfesionalAndYear.novias.length > 0) {
          byProfessionalAndYear.push(reportByProfesionalAndYear);
        }
      }
      var allReports = { 'byProfessionalAndYear': byProfessionalAndYear };
      $scope.reports = allReports;
    };

    var _addNoviaToYear = function(novia, reportsByYearAndMonth) {
      // Get novia year
      if (novia.weddingDate) {
        var year = new Date(novia.weddingDate).getFullYear();
        var month = new Date(novia.weddingDate).getMonth()+1;
        // Search for year
        var yearObj = _searchById(year, reportsByYearAndMonth);
        // Create year if not exists
        if (yearObj === null) {
          yearObj = { 'id': year, 'novias': 0, 'months': [], 'services': [] };
          reportsByYearAndMonth.push(yearObj);
        }
        _addNoviaToObj(novia, yearObj);
        // Search for month in year
        var monthObj = _searchById(month, yearObj.months);
        // Create month if not exists
        if (monthObj === null) {
          monthObj = { 'id': month, 'text': textMonths[month-1], 'novias': 0, 'services': [] };
          yearObj.months.push(monthObj);
        }
        _addNoviaToObj(novia, monthObj);
      }
    };

    var _addNoviaToObj = function(novia, obj) {
      // Add one novia
      obj.novias = obj.novias+1;
      // Loop over novia services
      for (var i=0; i<novia.services.length; i++) {
        if (novia.services[i].quantity > 0) {
          // Check if service exists
          var service = _searchById(novia.services[i].seq, obj.services);
          if (service === null) {
            // Create service if not exists
            service = { 'id': novia.services[i].seq, 'text': _searchServiceText(novia.services[i].seq), 'number': 0 };
            obj.services.push(service);
          }
          // Increase number of services
          service.number = service.number + novia.services[i].quantity;
        }
      }
    };

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
        return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
      };
    };

    // Find a list of Prospects
    $scope.findYear = function () {
      // Load novias information
      Novias.query({}, function(results) {
        $scope.novias = results;
        // Load Services information
        Servicios.query({}, function(results) {
          $scope.services = results;
          _createReportByYear($scope.novias, null, $scope.services);
        });
      });
    };

    // Find a list of Prospects
    $scope.findProf = function () {
      // Load novias information
      Novias.query({}, function(results) {
        $scope.novias = results;
        // Load professionals information
        Profesionales.query({},function(results) {
          $scope.profesionales = results;
          Servicios.query({}, function(results) {
            $scope.services = results;
            _createReportByProf($scope.novias, $scope.profesionales, $scope.services);
          });
        });
      });
    };

  }
]);
