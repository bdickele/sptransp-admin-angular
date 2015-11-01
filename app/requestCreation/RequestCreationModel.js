'use strict';

angular.module('SpTransp.RequestCreation')
    .service('RequestCreationModel', RequestCreationModel);

function RequestCreationModel($http, EndpointConfigService) {
    var model = this;
    var URL = "requests/";

    model.create = function(request) {
        console.log(request);
        return $http.post(EndpointConfigService.getUrl(URL), request);
    };
}