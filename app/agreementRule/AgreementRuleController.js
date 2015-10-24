'use strict';

angular.module('SpTransp.AgreementRule')
    .controller('AgreementRuleCtrl', AgreementRuleCtrl);

function AgreementRuleCtrl($log, $scope, $location, $routeParams, AgreementRuleModel, AgreementRulesModel, MainModel) {
    var agreementRule = this;

    agreementRule.editedRule = {};
    agreementRule.rule = null;
    agreementRule.creationMode = false;
    agreementRule.editionMode = false;
    agreementRule.departments = [];

    $scope.showOverallErrorMsg = false;
    $scope.saveErrorMsg = "";

    $scope.panelStyle = "panel panel-info";

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
        if (!rule.reqAllowed) $scope.panelStyle = 'panel panel-danger';
    };

    agreementRule.getRule = function(destinationCode, goodsCode) {
        // If rule cannot be found it means
        // - either that that rule does not exist yet for that destination and goods => we switch to creation mode
        // - or goods code or destination code is incorrect
        AgreementRuleModel.getAgreementRule(destinationCode, goodsCode).then(function(result) {
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
            $scope.destination.name = result.data.name;
            agreementRule.checkGoodsCode($scope.goods.code);
        }, function(reason) {
            agreementRule.redirectToRuleList();
        });
    };

    agreementRule.checkGoodsCode = function(goodsCode) {
        AgreementRuleModel.getGoods(goodsCode).then(function(result) {
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
            reqAllowed: true,
            agreementVisas: []
        };
        agreementRule.selectRule(rule, false);
    };

    agreementRule.getDepartments = function() {
        MainModel.getAvailableDepartments().then(function(result) {
           agreementRule.departments = result;
        });
    };

    agreementRule.redirectToRuleList = function() {
        $location.path('agreementRules/');
    };


    agreementRule.getDepartments();
    agreementRule.getRule($scope.destination.code, $scope.goods.code);

    // ========================================================================
    // Methods to handle visas (add, remove ...)
    // ========================================================================

    agreementRule.removeVisa = function(index) {
        var visas = agreementRule.editedRule.agreementVisas;
        if (visas.length < 2) return;
        agreementRule.editedRule.agreementVisas.splice(index, 1);
    };

    agreementRule.addVisa = function() {
        agreementRule.editedRule.agreementVisas.push({
                departmentCode : agreementRule.departments[0].code,
                seniority: 10}
        );
    };

    agreementRule.moveVisaLeft = function(index) {
        var visas = agreementRule.editedRule.agreementVisas;
        if (index<=0) return;

        var visasBefore = visas.slice(0, index-1);
        var visaToMoveToTheLeft = visas.slice(index, index+1);
        var visaToMoveToTheRight = visas.slice(index-1, index);
        var visasAfter = visas.slice(index+1);

        agreementRule.editedRule.agreementVisas = visasBefore
            .concat(visaToMoveToTheLeft)
            .concat(visaToMoveToTheRight)
            .concat(visasAfter);
    };

    agreementRule.moveVisaRight = function(index) {
        var visas = agreementRule.editedRule.agreementVisas;
        if (index>(visas.length-1)) return;

        var visasBefore = [];
        if (index > 0) {
            visasBefore = visas.slice(0, index);
        }
        var visaToMoveToTheLeft = visas.slice(index+1, index+2);
        var visaToMoveToTheRight = visas.slice(index, index+1);
        var visasAfter = visas.slice(index+2);

        /*
        $log.debug(visasBefore);
        $log.debug(visaToMoveToTheLeft);
        $log.debug(visaToMoveToTheRight);
        $log.debug(visasAfter);
        */

        agreementRule.editedRule.agreementVisas = visasBefore
            .concat(visaToMoveToTheLeft)
            .concat(visaToMoveToTheRight)
            .concat(visasAfter);
    };

    // ========================================================================
    // Methods to cancel, save, ban or unban agreement rule
    // ========================================================================

    agreementRule.copyEditedRule = function() {
        var fields = ['destinationCode', 'goodsCode', 'reqAllowed', 'agreementVisas'];

        fields.forEach(function (field) {
            //console.log(field + ' > ' + agreementRule.editedRule[field]);
            agreementRule.rule[field] = agreementRule.editedRule[field];
        });
    }

    agreementRule.create = function() {
        agreementRule.copyEditedRule();
        AgreementRuleModel.createRule(agreementRule.rule).then(function (result) {
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            $location.path(AgreementRulesModel.getUrl());
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not create rule: " + reason.statusText;
            $log.error('Could not create rule', reason);
        });
    }

    agreementRule.update = function() {
        agreementRule.copyEditedRule();
        AgreementRuleModel.updateRule(agreementRule.rule).then(function (result) {
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            $location.path(AgreementRulesModel.getUrl());
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not update rule: " + reason.statusText;
            $log.error('Could not update rule', reason);
        });
    };
}