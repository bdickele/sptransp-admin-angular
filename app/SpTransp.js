'use strict';

// Declare app level module which depends on views, and components
var myModule = angular.module('SpTransp', [
    'ngRoute',
    'SpTransp.Common',
    'SpTransp.Employees'
]);

myModule.config(function($routeProvider) {
  $routeProvider
      .when('/', {
          templateUrl: 'employees/employees.html',
          controller: 'EmployeesCtrl',
          controllerAs: 'employees',
          requiresLogin: false
      })
      .when('/employees', {
          templateUrl: 'employees/employees.html',
          controller: 'EmployeesCtrl',
          controllerAs: 'employees',
          requiresLogin: false
      })
      .otherwise({redirectTo: '/employees'});
});
