'use strict';

// Declare app level module which depends on views, and components
var myModule = angular.module('SpTransp', [
    'ngRoute',
    'SpTransp.Login',
    'SpTransp.Common',
    'SpTransp.Employees',
    'SpTransp.EmployeeForm',
    'SpTransp.Customers'
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
            requiresLogin: false
        })
        .when('/employees/:uid', {
            templateUrl: 'employeeForm/employeeForm.html',
            controller: 'EmployeeFormCtrl',
            controllerAs: 'employee',
            requiresLogin: false
        })
        .when('/customers', {
            templateUrl: 'customers/customers.html',
            controller: 'CustomersCtrl',
            controllerAs: 'customers',
            requiresLogin: false
        })
        .otherwise({redirectTo: '/'});

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});
