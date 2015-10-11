'use strict';

// Declare app level module which depends on views, and components
var myModule = angular.module('SpTransp', [
    'ngRoute',
    'SpTransp.Login',
    'SpTransp.Common',
    'SpTransp.Employees',
    'SpTransp.EmployeeForm'
]);

myModule.config(function($routeProvider, $httpProvider) {

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
            requiresLogin: true
        })
        .when('/employees/:uid', {
            templateUrl: 'employeeForm/employeeForm.html',
            controller: 'EmployeeFormCtrl',
            controllerAs: 'employee',
            requiresLogin: true
        })
        .otherwise({redirectTo: '/'});

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});
