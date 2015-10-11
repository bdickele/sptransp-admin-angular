'use strict';

angular.module('SpTransp.EmployeeForm')
    .controller('EmployeeFormCtrl', EmployeeFormCtrl);

function EmployeeFormCtrl($log, $routeParams, $location, MainModel, EmployeeFormModel, EmployeesModel) {
    var employee = this;

    employee.employeeUid = $routeParams['uid'];

    employee.availableDepartments = [];
    employee.availableProfiles = [];

    employee.currentEmployee = {};
    employee.editedEmployee = {};

    employee.title = "";
    employee.creationMode = false;

    if (employee.employeeUid == "new") employee.creationMode = true;


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

    employee.initNewEmployee = function() {
        employee.currentEmployee['fullName'] = '';
        employee.currentEmployee['profileCode'] = 'HR_READER';
        employee.currentEmployee['departmentCode'] = 'HR';
        employee.currentEmployee['seniority'] = 10;
        employee.editedEmployee = angular.copy(employee.currentEmployee);
        employee.title = "New employee";
    };

    employee.retrieveEmployee = function() {
        EmployeeFormModel.getEmployee(employee.employeeUid)
            .then(function(result) {
                employee.currentEmployee = result.data;
                employee.editedEmployee = angular.copy(employee.currentEmployee);
                employee.title = "Employee " + employee.currentEmployee.fullName;
            }, function(reason) {
                $log.error("Could not retrieve employee with uid " + employee.employeeUid + " : " + reason);
            });
    };

    // When cancelling : in creation mode we go back to list of employees
    employee.cancel = function() {
        employee.resetForm();
        $location.path(EmployeesModel.getUrl());
    }

    employee.resetForm = function() {
        employee.editedEmployee = angular.copy(employee.currentEmployee);
        employee.formEmployee.$setPristine();
        employee.formEmployee.$setUntouched();
    };

    employee.update = function() {
        EmployeeFormModel.updateEmployee(employee.employeeUid, employee.editedEmployee)
            .then(function (result) {
                $location.path(EmployeesModel.getUrl());
            }, function (reason) {
                $log.error('Could not save employee', reason);
            });
    }

    employee.create = function(addAnotherOne) {
        EmployeeFormModel.createEmployee(employee.editedEmployee)
            .then(function (result) {
                if (!addAnotherOne) {
                    $location.path(EmployeesModel.getUrl());
                } else {
                    employee.initNewEmployee();
                }
            }, function (reason) {
                $log.error('Could not create employee', reason);
            });
    };

    employee.save = function(addAnotherOne) {
        var fields = ['uid', 'profileCode', 'fullName', 'departmentCode', 'seniority'];

        fields.forEach(function (field) {
            employee.currentEmployee[field] = employee.editedEmployee[field]
        });

        // Creation of a new employee
        if (employee.creationMode) {
            employee.create(addAnotherOne);
        } else {
            employee.update();
        }
    };

    employee.getAvailableDepartments();
    employee.getEmployeeProfiles();

    if (employee.creationMode) {
        employee.initNewEmployee();
    } else {
        employee.retrieveEmployee();
    }
};
