'use strict';

angular.module('SpTransp.AgreementRules')
    .controller('AgreementRulesCtrl', AgreementRulesCtrl);

function AgreementRulesCtrl(AgreementRulesModel, MainModel) {
    var agreementRules = this;

    agreementRules.displayMode = "destination";
    agreementRules.selectedDestination = "all";
    agreementRules.selectedGoods = "all";

    agreementRules.selectDisplayMode = function(value) {
        agreementRules.displayMode = value;
        //TODO re-actualisation de l'affichage
        console.log(">> " + value);
    }

    agreementRules.availableDestinations = [];
    agreementRules.availableGoods = [];


    agreementRules.getAvailableDestinations = function() {
        MainModel.getAvailableDestinations().then(function(result) {
            agreementRules.availableDestinations = [{code: 'all', name: '--- ALL ---'}].concat(result);
        });
    };

    agreementRules.getAvailableGoods = function() {
        MainModel.getAvailableGoods().then(function(result) {
            agreementRules.availableGoods = [{code: 'all', name: '--- ALL ---'}].concat(result);
        });
    };

    agreementRules.getAvailableDestinations();
    agreementRules.getAvailableGoods();
};