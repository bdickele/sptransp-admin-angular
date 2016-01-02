'use strict';

angular.module('SpTransp.RequestCreation')
    .controller('RequestCreationCtrl', RequestCreationCtrl);

function RequestCreationCtrl($log, $location, $scope, MainModel, CustomersModel, RequestCreationModel, AgreementRuleModel) {
    var newRequest = this;

    newRequest.goods = [];
    newRequest.departures = [];
    newRequest.arrivals = [];
    newRequest.customers = [];

    $scope.customerUid = '';
    $scope.goodsCode = 'OIL';
    $scope.departureCode = 'EARTH';
    $scope.arrivalCode = 'MOON';

    $scope.requestAllowed = false;

    $scope.showOverallErrorMsg = false;
    $scope.showNotAllowedMsg = false;
    $scope.requestNotAllowedMsg = "";
    $scope.saveErrorMsg = "";

    newRequest.getDestinations = function() {
        MainModel.getDestinations().then(function(result) {
            newRequest.departures = result;
            newRequest.arrivals = result;
        });
    };

    newRequest.getGoods = function() {
        MainModel.getGoods().then(function(result) {
            newRequest.goods = result;
        });
    };

    newRequest.getCustomers = function() {
        CustomersModel.getCustomers().then(function(result) {
            newRequest.customers = result;
            $scope.customerUid = result[0].uid;
        });
    };

    newRequest.create = function() {
        RequestCreationModel.create({
            customerUid : $scope.customerUid,
            goodsCode : $scope.goodsCode,
            departureCode : $scope.departureCode,
            arrivalCode : $scope.arrivalCode
        }).then(function (result) {
            var request = result.data;
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            $location.path('request/' + request.reference);
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not create request: " + reason.statusText;
            $log.error('Could not create request', reason);
        });
    };

    // A request cannot be allowed when rule says it is not allowed or when rule doesn't exist
    newRequest.checkIfRequestAllowed = function() {
        $scope.requestAllowed = true;
        $scope.showOverallErrorMsg = false;
        $scope.showNotAllowedMsg = false;
        $scope.requestNotAllowedMsg = "";
        $scope.saveErrorMsg = "";

        if ($scope.departureCode == $scope.arrivalCode) {
            $scope.showNotAllowedMsg = true;
            $scope.requestNotAllowedMsg = "Arrival and departure can't be the same";
            $scope.requestAllowed = false;
        } else {
            AgreementRuleModel.getAgreementRule($scope.arrivalCode, $scope.goodsCode)
                .then(function (result) {
                    var rule = result.data;
                    $scope.allowed = rule.allowed;
                    $scope.showNotAllowedMsg = !rule.allowed;
                    $scope.requestNotAllowedMsg = "Unfortunatly we can't currently send this type of goods to that place";
                }, function (reason) {
                    $scope.showNotAllowedMsg = true;
                    $scope.requestAllowed = false;
                });
        }
    };

    newRequest.checkIfRequestAllowed();
    newRequest.getDestinations();
    newRequest.getGoods();
    newRequest.getCustomers();
}