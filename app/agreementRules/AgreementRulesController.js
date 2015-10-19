'use strict';

angular.module('SpTransp.AgreementRules')
    .controller('AgreementRulesCtrl', AgreementRulesCtrl);

function AgreementRulesCtrl($log, $location, $scope, AgreementRulesModel, MainModel) {
    var agreementRules = this;

    $scope.selectedDestination = "all";
    $scope.selectedGoods = "all";
    $scope.displayMode = "";

    // Map -> Key = destinationCode#goodsCode, Value = agreement rule
    agreementRules.mapRules = [];

    agreementRules.destinations = [];
    agreementRules.destinationsForSelect = [];
    // Key = destination code, Value = destination label
    agreementRules.mapDestination = {};

    agreementRules.goods = [];
    agreementRules.goodsForSelect = [];
    // Key = goods code, Value = destination label
    agreementRules.mapGoods = {};

    agreementRules.availableDepartments = [];


    $scope.selectDisplayMode = function(value) {
        $scope.displayMode = value;
    };

    agreementRules.selectRule = function(destinationCode, goodsCode) {
        var destination = AgreementRulesModel.getUrl() + destinationCode.toLowerCase() + "/" + goodsCode.toLowerCase();
        $location.path(destination);
    };

    agreementRules.getRule = function(destinationCode, goodsCode) {
        var key = destinationCode + '#' + goodsCode;
        var rule = agreementRules.mapRules[key];

        // If rule does not exist we create a new one
        if (rule==null) {
            var newRule = {
                destinationCode: destinationCode,
                destinationName: agreementRules.mapDestination[destinationCode],
                goodsCode: goodsCode,
                goodsName: agreementRules.mapGoods[goodsCode],
                reqAllowed: true,
                agreementVisas: []
            };
            agreementRules.mapRules[key] = newRule;
            return newRule;
        } else {
            return rule;
        }
    };

    agreementRules.fromListToMapCodeLabel = function(map, list) {
        for (var i=0; i<list.length; i++) {
            // Map with Key = code and Value = label
            map[list[i].code] = list[i].name;
        }
    };

    agreementRules.getAvailableDestinations = function() {
        MainModel.getAvailableDestinations().then(function(result) {
            agreementRules.fromListToMapCodeLabel(agreementRules.mapDestination, result);
            agreementRules.destinations = result;
            agreementRules.destinationsForSelect = [{code: 'all', name: '--- ALL ---'}].concat(result);
            agreementRules.getAvailableGoods();
        });
    };

    agreementRules.getAvailableGoods = function() {
        MainModel.getAvailableGoods().then(function(result) {
            agreementRules.fromListToMapCodeLabel(agreementRules.mapGoods, result);
            agreementRules.goods = result;
            agreementRules.goodsForSelect = [{code: 'all', name: '--- ALL ---'}].concat(result);
            agreementRules.getAvailableDepartments();
        });
    };

    agreementRules.getAvailableDepartments = function() {
        MainModel.getAvailableDepartments().then(function(result) {
            agreementRules.getRules();
        });
    };

    agreementRules.getRules = function() {
        AgreementRulesModel.getAgreementRules().then(function(result) {
            agreementRules.treatRules(result);
        });
    };

    agreementRules.treatRules = function(rules) {
        for (var i=0; i<rules.length; i++) {
            var rule = rules[i];
            var key = rule.destinationCode + '#' + rule.goodsCode;
            agreementRules.mapRules[key] = rule;
        }

        $scope.selectDisplayMode('destination');
    };

    agreementRules.getAvailableDestinations();
};