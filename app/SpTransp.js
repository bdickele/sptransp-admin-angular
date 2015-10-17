'use strict';

// Declare app level module which depends on views, and components
var myModule = angular.module('SpTransp', [
    'ngRoute',
    'SpTransp.Login',
    'SpTransp.Common',
    'SpTransp.AgreementRule',
    'SpTransp.AgreementRules',
    'SpTransp.Employee',
    'SpTransp.Employees',
    'SpTransp.Customers',
    'SpTransp.Customer'
]);

myModule.config(function($routeProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'employees/employees.html',
            controller: 'EmployeesCtrl',
            controllerAs: 'employees',
            requiresLogin: false
        })
        .when('/agreementRules', {
            templateUrl: 'agreementRules/agreementRules.html',
            controller: 'AgreementRulesCtrl',
            controllerAs: 'agreementRules',
            requiresLogin: false
        })
        .when('/agreementRules/:destinationCode/:goodsCode', {
            templateUrl: 'agreementRule/agreementRule.html',
            controller: 'AgreementRuleCtrl',
            controllerAs: 'agreementRule',
            requiresLogin: false
        })
        .when('/employees', {
            templateUrl: 'employees/employees.html',
            controller: 'EmployeesCtrl',
            controllerAs: 'employees',
            requiresLogin: false
        })
        .when('/employees/:uid', {
            templateUrl: 'employee/employee.html',
            controller: 'EmployeeCtrl',
            controllerAs: 'employee',
            requiresLogin: false
        })
        .when('/customers', {
            templateUrl: 'customers/customers.html',
            controller: 'CustomersCtrl',
            controllerAs: 'customers',
            requiresLogin: false
        })
        .when('/customers/:uid', {
            templateUrl: 'customer/customer.html',
            controller: 'CustomerCtrl',
            controllerAs: 'customer',
            requiresLogin: false
        })
        .otherwise({redirectTo: '/'});

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
});
