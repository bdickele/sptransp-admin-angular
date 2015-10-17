'use strict';

angular.module('SpTransp.AgreementRule')
    .controller('AgreementRuleCtrl', AgreementRuleCtrl);

function AgreementRuleCtrl($log, $scope, $location, $routeParams, AgreementRuleModel) {
    var agreementRule = this;

    agreementRule.editedRule = {};
    agreementRule.rule = null;
    agreementRule.creationMode = false;
    agreementRule.editionMode = false;

    $scope.destination = {
        code: $routeParams['destinationCode'].toUpperCase(),
        name : ''
    };

    $scope.goods = {
        code : $routeParams['goodsCode'].toUpperCase(),
        name : ''
    };

    agreementRule.selectRule = function(rule, editionMode) {
        agreementRule.editionMode = editionMode;
        agreementRule.creationMode = !editionMode;
        agreementRule.rule = rule;
        agreementRule.editedRule = angular.copy(agreementRule.rule);
    };

    agreementRule.getRule = function(destinationCode, goodsCode) {
        // If rule cannot be found it means
        // - either that that rule does not exist yet for that destination and goods => we switch to creation mode
        // - or goods code or destination code is incorrect
        AgreementRuleModel.getAgreementRule(destinationCode, goodsCode).then(function(result) {
                $log.debug("Found a rule", result);
                var rule = result.data;
                $scope.destination.name = rule.destinationName;
                $scope.goods.name = rule.goodsName;
                agreementRule.selectRule(rule, true);
        }, function(reason) {
                $log.debug("Rule not found, let's check if destination code and goods code are correct...");
                agreementRule.checkDestinationCode($scope.destination.code);
            }
        );
    };

    agreementRule.checkDestinationCode = function(destinationCode) {
        AgreementRuleModel.getDestination(destinationCode).then(function(result) {
            $log.debug("Destination is OK : " + result.data.name);
            $scope.destination.name = result.data.name;
            agreementRule.checkGoodsCode($scope.goods.code);
        }, function(reason) {
            agreementRule.redirectToRuleList();
        });
    };

    agreementRule.checkGoodsCode = function(goodsCode) {
        AgreementRuleModel.getGoods(goodsCode).then(function(result) {
            $log.debug("Goods is OK : " + result.data.name);
            $scope.goods.name = result.data.name;
            agreementRule.createBlankRule($scope.destination, $scope.goods);
        }, function(reason) {
            agreementRule.redirectToRuleList();
        });
    };

    agreementRule.createBlankRule = function(destination, goods) {
        var rule = {
            destinationCode : destination.code,
            destinationName: destination.name,
            goodsCode : goods.code,
            goodsName: goods.name,
            allowed: true,
            agreementVisas: []
        };
        agreementRule.selectRule(rule, false);
    };

    agreementRule.redirectToRuleList = function() {
        $location.path('agreementRules/');
    };

    agreementRule.getRule($scope.destination.code, $scope.goods.code);
}