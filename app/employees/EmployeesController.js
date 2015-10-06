'use strict';

angular.module('SpTransp.Employees')
    .controller('EmployeesCtrl', EmployeesCtrl);

function EmployeesCtrl($log, EmployeesModel, MainModel) {
    var employees = this;

    // List of all employees
    employees.list = [];

    employees.availableDepartments = [];

    employees.employeeSelected = false;
    employees.currentEmployeeUid = null;
    employees.currentEmployee = null;
    employees.editedEmployee = {};

    employees.getAvailableDepartments = function() {
        MainModel.getAvailableDepartments()
            .then(function(result) {
                employees.availableDepartments = result;
            });
    };

    employees.getAllEmployees = function() {
        //EmployeesModel.all().then
        employees.list = EmployeesModel.all();
    };

    employees.selectEmployee = function(employee) {
        employees.employeeSelected = true;
        employees.currentEmployeeUid = employee.uid;
        employees.currentEmployee = employee;
        employees.editedEmployee = angular.copy(employees.currentEmployee);
    };

    employees.cancel = function() {
        employees.resetForm();
    }

    employees.resetForm = function() {
        employees.currentEmployee = null;
        employees.editedEmployee = {};
        employees.formEmployee.$setPristine();
        employees.formEmployee.$setUntouched();
        employees.employeeSelected = false;
    };

    employees.getAvailableDepartments();
    employees.getAllEmployees();
}