'use strict';

angular.module('SpTransp.AgreementRules')
    .service('AgreementRulesModel', AgreementRulesModel);

function AgreementRulesModel($http, EndpointConfigService, UtilsService) {
    var model = this,
        URL = "agreementRules/";

    model.getUrl = function() {return URL};

    model.getAgreementRules = function() {
        return $http
            .get(EndpointConfigService.getUrl(URL + EndpointConfigService.getCurrentFormat()))
            .then(function(result) {
                return UtilsService.objectToArray(result);
            }
        );
    };
};