'use strict';

angular.module('SpTransp.AgreementRule')
    .service('AgreementRuleModel', AgreementRuleModel);

function AgreementRuleModel($http, AgreementRulesModel, EndpointConfigService, UtilsService) {
    var model = this,
        URL = AgreementRulesModel.getUrl();

    model.getAgreementRule = function(destinationCode, goodsCode) {
        return $http.get(EndpointConfigService.getUrl(
            URL + destinationCode + "/" + goodsCode + "/" + EndpointConfigService.getCurrentFormat()));
    };

    model.getDestination = function(destinationCode) {
        return $http.get(EndpointConfigService.getUrl(
            "destinations/" + destinationCode + "/" + EndpointConfigService.getCurrentFormat()));
    };

    model.getGoods = function(goodsCode) {
        return $http.get(EndpointConfigService.getUrl(
            "goods/" + goodsCode + "/" + EndpointConfigService.getCurrentFormat()));
    };
};