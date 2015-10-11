'use strict';

angular.module("SpTransp.Employees")
    .service("EmployeesModel", EmployeesModel);

function EmployeesModel($http, EndpointConfigService, UtilsService) {
    var model = this,
        URL = "employees/";

    model.getUrl = function() {return URL};

    model.getEmployees = function() {
        return $http
            .get(EndpointConfigService.getUrl(URL + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };
};