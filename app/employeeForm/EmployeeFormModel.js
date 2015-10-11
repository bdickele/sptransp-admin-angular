'use strict';

angular.module("SpTransp.EmployeeForm")
    .service("EmployeeFormModel", EmployeeFormModel);

function EmployeeFormModel($log, $http, EndpointConfigService, UtilsService) {
    var model = this,
        URL = "employees/";

    model.getEmployee = function(employeeUid) {
        return $http.get(EndpointConfigService.getUrlForId(URL, employeeUid));
    };

    model.updateEmployee = function (employeeUid, employee) {
        return $http.put(EndpointConfigService.getUrlForId(URL, employeeUid), employee);
    };

    model.getEmployeeProfiles = function() {
        return $http
            .get(EndpointConfigService.getUrl('employeeProfiles/' + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                //$log.debug(UtilsService.objectToArray(result));
                return UtilsService.objectToArray(result);
            }
        );
    };
};