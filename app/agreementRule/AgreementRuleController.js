'use strict';

angular.module('SpTransp.AgreementRule')
    .controller('AgreementRuleCtrl', AgreementRuleCtrl);

function AgreementRuleCtrl($log, $scope, $location, $routeParams, AgreementRuleModel, AgreementRulesModel, MainModel) {
    var agreementRule = this;

    agreementRule.editedRule = {};
    agreementRule.rule = null;
    agreementRule.creationMode = false;
    agreementRule.editionMode = false;

    $scope.showOverallErrorMsg = false;
    $scope.saveErrorMsg = "";
    $scope.panelStyle = "panel panel-info";

    agreementRule.departments = [];

    agreementRule.destinationList = [];
    agreementRule.selectedDestination = {
        code: $routeParams['destinationCode'].toUpperCase(),
        name: ''
    };

    agreementRule.goodsList = [];
    agreementRule.selectedGoods = {
        code: $routeParams['goodsCode'].toUpperCase(),
        name: ''
    };

    agreementRule.selectRule = function(rule, editionMode) {
        agreementRule.editionMode = editionMode;
        agreementRule.creationMode = !editionMode;
        agreementRule.rule = rule;
        agreementRule.editedRule = angular.copy(agreementRule.rule);
        if (!rule.reqAllowed) {
            $scope.panelStyle = 'panel panel-danger';
        } else {
            $scope.panelStyle = 'panel panel-info';
        }
    };

    agreementRule.getRule = function(destinationCode, goodsCode) {
        // If rule cannot be found it means
        // - either that that rule does not exist yet for that destination and goods => we switch to creation mode
        // - or goods code or destination code is incorrect
        AgreementRuleModel.getAgreementRule(destinationCode, goodsCode).then(function(result) {
                var rule = result.data;
                agreementRule.selectedDestination.name = rule.destinationName;
                agreementRule.selectedGoods.name = rule.goodsName;
                $scope.showOverallErrorMsg = false;
                $scope.saveErrorMsg = "";
                agreementRule.selectRule(rule, true);
        }, function(reason) {
                $log.debug("Rule not found, let's check if destination code and goods code are correct...");
                agreementRule.checkDestinationCode(agreementRule.selectedDestination.code);
            }
        );
    };

    agreementRule.checkDestinationCode = function(code) {
        AgreementRuleModel.getDestination(code).then(function(result) {
            agreementRule.selectedGoods = result;
            agreementRule.checkGoodsCode(agreementRule.selectedGoods.code);
        }, function(reason) {
            agreementRule.redirectToRuleList();
        });
    };

    agreementRule.checkGoodsCode = function(code) {
        AgreementRuleModel.getGoods(code).then(function(result) {
            agreementRule.selectedGoods = result;
            agreementRule.createBlankRule();
        }, function(reason) {
            agreementRule.redirectToRuleList();
        });
    };

    agreementRule.createBlankRule = function() {
        var rule = {
            destinationCode : agreementRule.selectedDestination.code,
            destinationName: agreementRule.selectedDestination.name,
            goodsCode : agreementRule.selectedGoods.code,
            goodsName: agreementRule.selectedGoods.name,
            reqAllowed: true,
            agreementVisas: []
        };
        agreementRule.selectRule(rule, false);
    };

    agreementRule.getDepartments = function() {
        MainModel.getDepartments().then(function(result) {
           agreementRule.departments = result;
        });
    };

    agreementRule.getDestinations = function() {
        MainModel.getDestinations().then(function(result) {
            agreementRule.destinationList = result;
        });
    };

    agreementRule.getGoods = function() {
        MainModel.getGoods().then(function(result) {
            agreementRule.goodsList = result;
        });
    };

    agreementRule.redirectToRuleList = function() {
        $location.path(AgreementRulesModel.getUrl());
    };


    agreementRule.getDepartments();
    agreementRule.getDestinations();
    agreementRule.getGoods();
    agreementRule.getRule(agreementRule.selectedDestination.code, agreementRule.selectedGoods.code);

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

        agreementRule.editedRule.agreementVisas = visasBefore
            .concat(visaToMoveToTheLeft)
            .concat(visaToMoveToTheRight)
            .concat(visasAfter);
    };

    // ========================================================================
    // Methods to cancel, save, or change rule
    // ========================================================================

    agreementRule.changeSelectedRule = function() {
        $location.path(AgreementRulesModel.getUrl() + agreementRule.selectedDestination.code
            + '/' + agreementRule.selectedGoods.code);
    };

    // In edition mode we refresh current rule. In creation mode we go back to list of rules
    agreementRule.cancel = function() {
        if (agreementRule.editionMode) {
            agreementRule.selectRule(agreementRule.rule, agreementRule.editionMode);
        } else {
            agreementRule.redirectToRuleList();
        }
    };

    agreementRule.copyEditedRule = function() {
        var fields = ['destinationCode', 'goodsCode', 'reqAllowed', 'agreementVisas'];

        fields.forEach(function (field) {
            agreementRule.rule[field] = agreementRule.editedRule[field];
        });
    };

    agreementRule.create = function() {
        agreementRule.copyEditedRule();
        AgreementRuleModel.createRule(agreementRule.rule).then(function (result) {
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            agreementRule.getRule($scope.destination.code, $scope.goods.code);
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not create rule: " + reason.statusText;
            $log.error('Could not create rule', reason);
        });
    };

    agreementRule.update = function() {
        agreementRule.copyEditedRule();
        AgreementRuleModel.updateRule(agreementRule.rule).then(function (result) {
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            agreementRule.getRule(agreementRule.rule.destinationCode, agreementRule.rule.goodsCode);
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not update rule: " + reason.statusText;
            $log.error('Could not update rule', reason);
        });
    };
}