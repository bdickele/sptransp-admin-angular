'use strict';

angular.module('SpTransp.AgreementRules')
    .controller('AgreementRulesCtrl', AgreementRulesCtrl);

function AgreementRulesCtrl($log, $location, $scope, $route, $routeParams, AgreementRulesModel, MainModel) {
    var agreementRules = this;
    const ALL = "ALL";

    // 'destination' or 'goods'
    // if url doesn't specify a destination code or a goods code, 'destination' is the display mode
    $scope.displayMode = "";

    $scope.selectedDestination = "";
    $scope.selectedGoods = "";

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

    // ---------------------------------------
    // Initialisation des infos necessaires
    // ---------------------------------------

    // Analyse des parametres de l'URL pour savoir dans quelle mode on est

    agreementRules.init = function() {
        var destinationCodeParam = $routeParams['d'];
        var goodsCodeParam = $routeParams['g'];
        if (goodsCodeParam) {
            $scope.displayMode = 'goods';
            $scope.selectedDestination = ALL;
            if (goodsCodeParam==undefined || goodsCodeParam=='') $scope.selectedGoods = ALL;
            else $scope.selectedGoods = goodsCodeParam.toUpperCase();
        } else {
            $scope.displayMode = 'destination';
            if (destinationCodeParam==undefined || destinationCodeParam=='') $scope.selectedDestination = ALL;
            else $scope.selectedDestination = destinationCodeParam.toUpperCase();
            $scope.selectedGoods = ALL;
        }

        agreementRules.getDestinations();
    };

    // Makes a Map out of a list, with Key = code and Value = label
    agreementRules.fromListToMapCodeLabel = function(list) {
        var map = {};
        for (var i=0; i<list.length; i++) {
            map[list[i].code] = list[i].name;
        }
        return map;
    };

    agreementRules.getDestinations = function() {
        MainModel.getDestinations().then(function(result) {
            agreementRules.mapDestination = agreementRules.fromListToMapCodeLabel(result);
            agreementRules.destinations = result;
            agreementRules.destinationsForSelect = [{code: ALL, name: '--- All ---'}].concat(result);

            // Si on est en mode d'affichage 'par destination' on verifie que le code de la destination
            // correspond a une valeur existante. Si ce n'est pas le cas, on le force à 'ALL'
            if (($scope.displayMode == 'destination')
                    && ($scope.selectedDestination != ALL)
                    && agreementRules.mapDestination[$scope.selectedDestination]==undefined) {
                $scope.selectedDestination = ALL;
                $location.search('d=all');
            }

            agreementRules.getGoods();
        });
    };

    agreementRules.getGoods = function() {
        MainModel.getGoods().then(function(result) {
            agreementRules.mapGoods = agreementRules.fromListToMapCodeLabel(result);
            agreementRules.goods = result;
            agreementRules.goodsForSelect = [{code: ALL, name: '--- All ---'}].concat(result);

            // Si on est en mode d'affichage 'par bien' on verifie que le code du bien
            // correspond a une valeur existante. Si ce n'est pas le cas, on le force à 'ALL'
            if (($scope.displayMode == 'goods')
                && ($scope.selectedGoods != ALL)
                && agreementRules.mapGoods[$scope.selectedGoods]==undefined) {
                $scope.selectedGoods = ALL;
                $location.search('g=all');
            }

            agreementRules.getDepartments();
        });
    };

    agreementRules.getDepartments = function() {
        MainModel.getDepartments().then(function(result) {
            agreementRules.availableDepartments = result;
            agreementRules.getRules();
        });
    };

    agreementRules.getRules = function() {
        AgreementRulesModel.getAllAgreementRules().then(function(result) {
            agreementRules.treatRules(result);
        });
    };

    agreementRules.treatRules = function(rules) {
        for (var i=0; i<rules.length; i++) {
            var rule = rules[i];
            var key = rule.destinationCode + '#' + rule.goodsCode;
            agreementRules.mapRules[key] = rule;
        }
    };

    // ---------------------------------------
    // Interaction avec la vue
    // ---------------------------------------

    $scope.changeCriteria = function() {
        var queryParam = 'd';
        var queryValue = $scope.selectedDestination;
        if ($scope.displayMode=='goods') {
            queryParam = 'g';
            queryValue = $scope.selectedGoods;
        }
        $location.search(queryParam + '=' + queryValue.toLocaleLowerCase());
    };

    $scope.ruleUrl = function(destinationCode, goodsCode) {
        return AgreementRulesModel.getUrl() + destinationCode.toLowerCase() + "/" + goodsCode.toLowerCase();
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
                allowed: true,
                visas: []
            };
            agreementRules.mapRules[key] = newRule;
            return newRule;
        } else {
            return rule;
        }
    };

    agreementRules.init();
};