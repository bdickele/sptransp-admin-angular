'use strict';

angular.module("SpTransp.Customer")
    .service("CustomerModel", CustomerModel);

function CustomerModel($http, EndpointConfigService) {
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