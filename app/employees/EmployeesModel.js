'use strict';

angular.module("SpTransp.Employees")
    .service("EmployeesModel", function($log, $http, EndpointConfigService, UtilsService) {
        var service = this,
            MODEL = "employees/",
            EMPLOYEE_PROFILES = "employeeProfiles/";

        service.getEmployees = function() {
            return $http
                .get(EndpointConfigService.getUrl(MODEL + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    //$log.debug(UtilsService.objectToArray(result));
                    return UtilsService.objectToArray(result);
                }
            );
        }

        service.getEmployeeProfiles = function() {
            return $http
                .get(EndpointConfigService.getUrl(EMPLOYEE_PROFILES + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    //$log.debug(UtilsService.objectToArray(result));
                    return UtilsService.objectToArray(result);
                }
            );
        };

        service.updateEmployee = function (employeeUid, employee) {
            return $http.put(
                EndpointConfigService.getUrlForId(MODEL, employeeUid), employee
            );
        };
    });