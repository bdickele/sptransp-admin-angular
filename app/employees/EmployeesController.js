'use strict';

angular.module('SpTransp.Employees')
    .controller('EmployeesCtrl', EmployeesCtrl);

function EmployeesCtrl($location, EmployeesModel) {
    var employees = this;

    // List of all employees
    employees.list = [];


    // To get the complete list of employees
    employees.getAllEmployees = function() {
        EmployeesModel.getEmployees().then(function(result) {
            employees.list = result;
        });
    };

    employees.selectEmployee = function(employee) {
        var destination = EmployeesModel.getUrl() + employee.uid;
        $location.path(destination);
    };

    employees.getAllEmployees();
}