'use strict';

angular.module('SpTransp.Request')
    .service('RequestModel', RequestModel);

function RequestModel($http, EndpointConfigService, UtilsService) {
    var model = this;
    var URL = 'requests/';


    model.getRequest = function(reference) {
        return $http.get(EndpointConfigService.getUrlForId(URL, reference));
    };

    model.getEmployees = function() {
        return $http.get(EndpointConfigService.getUrl('employees/' + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };

    model.grantOrDenyVisa = function(requestReference, visa) {
        return $http.put(EndpointConfigService.getUrlForId(URL, requestReference), visa);
    }
}