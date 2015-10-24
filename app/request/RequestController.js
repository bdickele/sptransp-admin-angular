'use strict';

angular.module('SpTransp.Request')
    .controller('RequestCtrl', RequestCtrl);

function RequestCtrl($log, $routeParams, $location, RequestModel) {
    var request = this;

    request.reference = $routeParams['reference'];
    request.request = {};
    request.request.remainingVisas = [];

    request.employees =[]
    request.selectedEmployee = null;

    request.getRequest = function(reference) {
        RequestModel.getRequest(reference).then(function(result) {
            request.request = result.data;
            request.computeRemainingVisas(request.request);
        });
    };

    request.computeRemainingVisas = function(request) {

        if (request.overallStatusCode!='WV') {
            return;
        }

        var requiredVisas = request.requiredAgreementVisas;
        var remainingVisas = [];
        var nextAgreementVisaRank = request.nextAgreementVisaRank;

        for (var i=nextAgreementVisaRank; i<requiredVisas.length; i++) {
            remainingVisas.push(requiredVisas[i]);
        }

        request.remainingVisas = remainingVisas;
    };

    request.getEmployees = function() {
        RequestModel.getEmployees().then(function(result) {
            request.selectedEmployee = result[0];
            request.employees = result;
        });
    };

    request.grantVisa = function() {
        request.grantOrDenyVisa('G');
    };

    request.denyVisa = function() {
        request.grantOrDenyVisa('D');
    };

    request.grantOrDenyVisa = function(status) {
        var visa = {
            employeeUid : request.selectedEmployee.uid,
            statusCode : status,
            comment : 'Lorem ipsum'
        };
        RequestModel.grantOrDenyVisa(request.request.reference, visa)
            .then(function (result) {
                $location.path('requests/beingValidated/');
            }, function (reason) {
                $log.error('Could not create employee', reason);
            });
    };

    request.getRequest(request.reference);
    request.getEmployees();
}