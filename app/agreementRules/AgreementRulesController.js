'use strict';

angular.module('SpTransp.AgreementRules')
    .controller('AgreementRulesCtrl', AgreementRulesCtrl);

function AgreementRulesCtrl($log, $location, $scope, AgreementRulesModel, MainModel) {
    var agreementRules = this;

    $scope.selectedDestination = "all";
    $scope.selectedGoods = "all";
    $scope.displayMode = "";

    agreementRules.availableDestinations = [];
    // Key = destination code, Value = destination label
    agreementRules.mapDestination = {};

    agreementRules.availableGoods = [];
    // Key = goods code, Value = destination label
    agreementRules.mapGoods = {};

    agreementRules.availableDepartments = [];
    // Key = department code, Value = department label
    agreementRules.mapDepartments = {};

    agreementRules.rulesPerDestination = [];
    agreementRules.rulesPerGoods = [];


    $scope.selectDisplayMode = function(value) {
        $scope.displayMode = value;
    };

    agreementRules.selectRule = function(destinationCode, goodsCode) {
        var destination = AgreementRulesModel.getUrl() + destinationCode.toLowerCase() + "/" + goodsCode.toLowerCase();
        $location.path(destination);
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
            agreementRules.availableDestinations = [{code: 'all', name: '--- ALL ---'}].concat(result);
            agreementRules.getAvailableGoods();
        });
    };

    agreementRules.getAvailableGoods = function() {
        MainModel.getAvailableGoods().then(function(result) {
            agreementRules.fromListToMapCodeLabel(agreementRules.mapGoods, result);
            agreementRules.availableGoods = [{code: 'all', name: '--- ALL ---'}].concat(result);
            agreementRules.getAvailableDepartments();
        });
    };

    agreementRules.getAvailableDepartments = function() {
        MainModel.getAvailableDepartments().then(function(result) {
            agreementRules.fromListToMapCodeLabel(agreementRules.mapDepartments, result);
            agreementRules.getRules();
        });
    };

    agreementRules.getRules = function() {
        AgreementRulesModel.getAgreementRules().then(function(result) {
            //$log.debug(result);
            agreementRules.treatRules(result);
        });
    };

    agreementRules.treatRules = function(rules) {
        var rulesPerDestinationMap = [];
        var rulesPerGoodsMap = [];

        for (var i=0; i<rules.length; i++) {
            var rule = rules[i];

            var destinationCode = rule.destinationCode;
            var destinationLabel = agreementRules.mapDestination[destinationCode];
            var goodsCode = rule.goodsCode;
            var goodsLabel = agreementRules.mapGoods[goodsCode];
            var requestAllowed = rule.allowed;

            if (!rulesPerDestinationMap[destinationCode]) {
                rulesPerDestinationMap[destinationCode] = {
                    code : destinationCode,
                    label : destinationLabel,
                    rules : []
                };
            }

            if (!rulesPerGoodsMap[goodsCode]) {
                rulesPerGoodsMap[goodsCode] = {
                    code : goodsCode,
                    label : goodsLabel,
                    rules : []
                };
            }

            var goodsRule = {
                goodsCode : goodsCode,
                goodsLabel : goodsLabel,
                allowed: requestAllowed,
                visas : []
            };

            var destinationRule = {
                destinationCode : destinationCode,
                destinationLabel : destinationLabel,
                allowed: requestAllowed,
                visas : []
            };

            if (rule.agreementVisas) {
                for (var j=0; j<rule.agreementVisas.length; j++) {
                    var agreementVisa = rule.agreementVisas[j];
                    var visa = {
                        departmentCode: agreementVisa.departmentCode,
                        departmentLabel : agreementRules.mapDepartments[agreementVisa.departmentCode],
                        seniority : agreementVisa.seniority
                    };

                    goodsRule.visas.push(visa);
                    destinationRule.visas.push(visa);
                }
            }

            rulesPerDestinationMap[destinationCode].rules.push(goodsRule);
            rulesPerGoodsMap[goodsCode].rules.push(destinationRule);
        }

        for (var destination in rulesPerDestinationMap) {
            agreementRules.rulesPerDestination.push(rulesPerDestinationMap[destination]);
        }

        for (var goods in rulesPerGoodsMap) {
            agreementRules.rulesPerGoods.push(rulesPerGoodsMap[goods]);
        }

        $scope.selectDisplayMode('destination');
        //$log.debug(agreementRules.rulesPerDestination);
        //$log.debug(agreementRules.rulesPerGoods);
    };

    agreementRules.getAvailableDestinations();
};