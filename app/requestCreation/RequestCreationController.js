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

    $scope.showOverallErrorMsg = false;
    $scope.showNotAllowedMsg = false;
    $scope.requestAllowed = false;
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
            $scope.showOverallErrorMsg = false;
            $scope.saveErrorMsg = "";
            $location.path('requests/beingValidated/');
        }, function (reason) {
            $scope.showOverallErrorMsg = true;
            $scope.saveErrorMsg = "Could not create request: " + reason.statusText;
            $log.error('Could not create request', reason);
        });
    };

    // A request cannot be allowed when rule says it is not allowed or when rule doesn't exist
    newRequest.checkIfRequestAllowed = function() {
        AgreementRuleModel.getAgreementRule($scope.arrivalCode, $scope.goodsCode)
            .then(function (result) {
                var rule = result.data;
                $scope.showNotAllowedMsg = !rule.reqAllowed;
                $scope.requestAllowed = rule.reqAllowed;
                $scope.showOverallErrorMsg = false;
                $scope.saveErrorMsg = "";
            }, function (reason) {
                $scope.showNotAllowedMsg = true;
                $scope.requestAllowed = false;
            });
    };

    newRequest.checkIfRequestAllowed();
    newRequest.getDestinations();
    newRequest.getGoods();
    newRequest.getCustomers();
}