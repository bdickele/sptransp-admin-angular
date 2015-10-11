'use strict';

angular.module("SpTransp.Customers")
    .service("CustomersModel", CustomersModel);

function CustomersModel($http, EndpointConfigService, UtilsService) {
    var model = this,
        URL = "customers/";

    model.getUrl = function() {return URL};

    model.getCustomers = function() {
        return $http
            .get(EndpointConfigService.getUrl(URL + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };
};