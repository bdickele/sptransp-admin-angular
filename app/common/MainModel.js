angular.module("SpTransp.Common")
    .service("MainModel", function($log, $http, EndpointConfigService, UtilsService) {
        var model = this,
            DEPARTMENTS = 'departments/',
            GOODS = 'goods/',
            DESTINATIONS = 'destinations/';

        model.getAvailableDepartments = function() {
            return $http
                .get(EndpointConfigService.getUrl(DEPARTMENTS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }

        model.getAvailableDestinations = function() {
            return $http
                .get(EndpointConfigService.getUrl(DESTINATIONS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }

        model.getAvailableGoods = function() {
            return $http
                .get(EndpointConfigService.getUrl(GOODS + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    return UtilsService.objectToArray(result);
                }
            );
        }
    });