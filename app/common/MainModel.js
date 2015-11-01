angular.module("SpTransp.Common")
    .service("MainModel", function($log, $http, EndpointConfigService, UtilsService) {
        var model = this,
            DEPARTMENTS = 'departments/',
            GOODS = 'goods/',
            DESTINATIONS = 'destinations/';

        model.getDepartments = function() {
            return $http
                .get(EndpointConfigService.getUrl(DEPARTMENTS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }

        model.getDestinations = function() {
            return $http
                .get(EndpointConfigService.getUrl(DESTINATIONS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }

        model.getGoods = function() {
            return $http
                .get(EndpointConfigService.getUrl(GOODS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }
    });