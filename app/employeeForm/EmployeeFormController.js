'use strict';

angular.module('SpTransp.EmployeeForm')
    .controller('EmployeeFormCtrl', EmployeeFormCtrl);

function EmployeeFormCtrl($log, $routeParams, $location, MainModel, EmployeeFormModel, EmployeesModel) {
    var employee = this;
    var employeeUid = $routeParams['uid'];

    employee.availableDepartments = [];
    employee.availableProfiles = [];

    employee.currentEmployee = null;
    employee.editedEmployee = {};


    employee.getAvailableDepartments = function() {
        MainModel.getAvailableDepartments().then(function(result) {
            employee.availableDepartments = result;
        });
    };

    employee.getEmployeeProfiles = function() {
        EmployeeFormModel.getEmployeeProfiles().then(function(result) {
            employee.availableProfiles = result;
        });
    };

    employee.retrieveEmployee = function() {
        EmployeeFormModel.getEmployee(employeeUid)
            .then(function(result) {
                employee.currentEmployee = result.data;
                employee.editedEmployee = angular.copy(employee.currentEmployee);
            }, function(reason) {
                $log.error("Could not retrieve employee with uid " + employeeUid + " : " + reason);
            });
    };

    employee.cancel = function() {
        employee.resetForm();
    }

    employee.resetForm = function() {
        employee.editedEmployee = angular.copy(employee.currentEmployee);
        employee.formEmployee.$setPristine();
        employee.formEmployee.$setUntouched();
    };

    employee.save = function() {
        var fields = ['uid', 'profileCode', 'fullName', 'departmentCode', 'seniority'];

        fields.forEach(function (field) {
            employee.currentEmployee[field] = employee.editedEmployee[field]
        });

        EmployeeFormModel.updateEmployee(employeeUid, employee.editedEmployee)
            .then(function (result) {
                $location.path(EmployeesModel.getUrl());
            }, function (reason) {
                $log.error('Could not save employee', reason);
            });
    };

    employee.getAvailableDepartments();
    employee.getEmployeeProfiles();
    employee.retrieveEmployee();
};
