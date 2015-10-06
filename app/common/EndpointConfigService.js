angular.module('SpTransp.Common')
    .constant('CURRENT_BACKEND', 'local')
    //.constant('CURRENT_BACKEND', 'firebase')
    .service('EndpointConfigService', function($rootScope, CURRENT_BACKEND) {
        var service = this,
            endpointMap = {
                firebase: { URI: 'https://flickering-heat-65.firebaseio.com/', root: 'clients/', format: '.json' },
                local: { URI: 'http://localhost:8080/', root: '', format: ''}
            },
            currentEndpoint = endpointMap[CURRENT_BACKEND],
            userId = null,
            backend = CURRENT_BACKEND;

        service.getUrl = function(model) {
            //return currentEndpoint.URI + currentEndpoint.root + userId + model;
            return currentEndpoint.URI + currentEndpoint.root + model;
        };

        service.getUrlForId = function(model, id) {
            return service.getUrl(model) + id + currentEndpoint.format;
        };

        service.getCurrentBackend = function() {
            return backend;
        };

        service.getCurrentFormat = function() {
            return currentEndpoint.format;
        };

        service.getCurrentURI = function() {
            return currentEndpoint.URI;
        };

        $rootScope.$on('onCurrentUserId', function(event, id){
            userId = id;
        });
    });