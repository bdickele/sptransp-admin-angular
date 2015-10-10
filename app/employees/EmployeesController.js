'use strict';

angular.module('SpTransp.Employees')
    .controller('EmployeesCtrl', EmployeesCtrl);

function EmployeesCtrl($log, EmployeesModel, MainModel) {
    var employees = this;

    // List of all employees
    employees.list = [];

    employees.availableDepartments = [];
    employees.availableProfiles = [];

    employees.employeeSelected = false;
    employees.currentEmployeeUid = null;
    employees.currentEmployee = null;
    employees.editedEmployee = {};

    employees.getAllEmployees = function() {
        EmployeesModel.getEmployees().then(function(result) {
            employees.list = result;
        });
    };

    employees.getAvailableDepartments = function() {
        MainModel.getAvailableDepartments().then(function(result) {
            employees.availableDepartments = result;
        });
    };

    employees.getEmployeeProfiles = function() {
        EmployeesModel.getEmployeeProfiles().then(function(result) {
                employees.availableProfiles = result;
            });
    };

    employees.selectEmployee = function(employee) {
        employees.employeeSelected = true;
        employees.currentEmployeeUid = employee.uid;
        employees.currentEmployee = employee;
        employees.editedEmployee = angular.copy(employees.currentEmployee);
    };

    employees.cancelEdition = function() {
        employees.resetForm();
    }

    employees.resetForm = function() {
        employees.currentEmployee = null;
        employees.currentEmployeeUid = null;
        employees.editedEmployee = {};
        employees.formEmployee.$setPristine();
        employees.formEmployee.$setUntouched();
        employees.employeeSelected = false;
    };

    employees.saveEdition = function() {
        var fields = ['uid', 'profileCode', 'fullName', 'departmentCode', 'seniority'];

        fields.forEach(function (field) {
            employees.currentEmployee[field] = employees.editedEmployee[field]
        });

        EmployeesModel.updateEmployee(employees.currentEmployeeUid, employees.editedEmployee)
            .then(function (result) {
                employees.getAllEmployees();
                employees.resetForm();
                $log.debug('RESULT', result);
            }, function (reason) {
                $log.error('REASON', reason);
            });
    };

    employees.getAvailableDepartments();
    employees.getEmployeeProfiles();
    employees.getAllEmployees();
}