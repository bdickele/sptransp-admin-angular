'use strict';

angular.module('SpTransp.Requests')
    .service('RequestsModel', RequestsModel);

function RequestsModel($http, EndpointConfigService, UtilsService) {
    var model = this;
    var URL_BEING_VALIDATED = "requests/beingValidated/",
        URL_VALIDATED_OR_REFUSED = "requests/grantedOrRefused/";

    model.getRequestsBeingValidated = function() {
        return $http
            .get(EndpointConfigService.getUrl(URL_BEING_VALIDATED + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };

    model.getRequestsGrantedOrRefused = function() {
        return $http
            .get(EndpointConfigService.getUrl(URL_VALIDATED_OR_REFUSED + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };

}