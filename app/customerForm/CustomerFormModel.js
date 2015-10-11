'use strict';

angular.module("SpTransp.CustomerForm")
    .service("CustomerFormModel", CustomerFormModel);

function CustomerFormModel($log, $http, EndpointConfigService, UtilsService) {
    var model = this,
        URL = "customers/";

    model.getCustomer = function(customerUid) {
        return $http.get(EndpointConfigService.getUrlForId(URL, customerUid));
    };

    model.createCustomer = function(customer) {
        return $http.post(EndpointConfigService.getUrl(URL), customer);
    };

    model.updateCustomer = function(customerUid, customer) {
        return $http.put(EndpointConfigService.getUrlForId(URL, customerUid), customer);
    };
};