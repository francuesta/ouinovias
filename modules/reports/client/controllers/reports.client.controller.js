'use strict';

// Prospects controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profesionales', 'Novias',
  function ($scope, $stateParams, $location, Authentication, Profesionales, Novias) {
    $scope.authentication = Authentication;

    var createReports = function(novias, profesionales) {
      // Reports by year and month
      var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      var textMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      var years = [2014, 2015, 2016, 2017, 2018, 2019, 2020];
      var reportsByYearAndMonth = [];
      // Loop over years and months to get years
      for (var i=0; i<years.length; i++) {
        var reportByYearAndMonth = { 'year': years[i], 'novias': [], 'months': [] };
        for (var j=0; j<months.length; j++) {
          var reportByMonth = { 'month': months[j], 'text': textMonths[j], 'novias': [] };
          // Loop over novias to check date
          for (var k=0; k<novias.length; k++) {
            if (novias[k].weddingDate) {
              var year = new Date(novias[k].weddingDate).getFullYear();
              var month = new Date(novias[k].weddingDate).getMonth()+1;
              if (year === years[i] && month === months[j]) {
                // Add info to year and month
                reportByYearAndMonth.novias.push(novias[k]);
                reportByMonth.novias.push(novias[k]);
              }
            }
          }
          if (reportByMonth.novias.length > 0) {
            reportByYearAndMonth.months.push(reportByMonth);
          }
        }
        // Add report of year if there is info
        if (reportByYearAndMonth.novias.length > 0) {
          reportsByYearAndMonth.push(reportByYearAndMonth);
        }
      }
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
      var allReports = { 'byYearAndMonth': reportsByYearAndMonth, 'byProfessionalAndYear': byProfessionalAndYear };
      $scope.reports = allReports;
    };

    // Find a list of Prospects
    $scope.find = function () {
      // Load novias information
      Novias.query({}, function(results) {
        $scope.novias = results;
        // Load professionals information
        Profesionales.query({},function(results) {
          $scope.profesionales = results;
          createReports($scope.novias, $scope.profesionales);
        });
      });
    };

  }
]);
