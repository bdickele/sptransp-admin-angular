'use strict';

angular.module('SpTransp.Requests')
    .service('RequestsModel', RequestsModel);

function RequestsModel($http, EndpointConfigService, UtilsService) {
    var model = this;
    var URL_BEING_VALIDATED = "requests/beingValidated",
        URL_VALIDATED_OR_REFUSED = "requests/grantedOrRefused";

    model.addPagination = function(size, page) {
        return "?size=" + size + "&page=" + page;
    };

    model.getRequestsBeingValidated = function(size, page) {
        return $http
            .get(EndpointConfigService.getUrl(URL_BEING_VALIDATED
                + model.addPagination(size, page) + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return result.data;
            }
        );
    };

    model.getRequestsGrantedOrRefused = function(size, page) {
        return $http
            .get(EndpointConfigService.getUrl(URL_VALIDATED_OR_REFUSED
                + model.addPagination(size, page) + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return result.data;
            }
        );
    };

}