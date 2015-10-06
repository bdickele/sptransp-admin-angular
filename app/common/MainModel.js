angular.module("SpTransp.Common")
    .service("MainModel", function($log, $http, EndpointConfigService, UtilsService) {
        var service = this,
            MODEL = 'departments/';

        service.getAvailableDepartments = function() {
            return $http
                .get(EndpointConfigService.getUrl(MODEL + EndpointConfigService.getCurrentFormat()))
                .then(function(result) {
                    //$log.debug(UtilsService.objectToArray(result));
                    return UtilsService.objectToArray(result);
                }
            );
        }
    });