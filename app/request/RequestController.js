'use strict';

angular.module('SpTransp.Request')
    .controller('RequestCtrl', RequestCtrl);

function RequestCtrl($log, $routeParams, $location, $scope, RequestModel) {
    var request = this;

    request.reference = $routeParams['reference'];
    request.request = {};
    request.request.remainingVisas = [];

    request.employees =[];
    request.selectedEmployee = {};

    $scope.requestIsGranted = false;
    $scope.requestIsRefused = false;
    $scope.requestIsWaitingForValidation = false;

    $scope.cssClassForOverallStatus = "";
    $scope.cssClassForAgreementStatus = "";

    // =====================================================
    // Retrieving what we need to display
    // =====================================================

    request.getRequest = function(reference) {
        RequestModel.getRequest(reference).then(function(result) {
            var req = result.data;

            var agreementStatusInfo = request.getRequestStatusInfo(req.agreementStatusCode);
            $scope.requestIsGranted = agreementStatusInfo.requestIsGranted;
            $scope.requestIsRefused = agreementStatusInfo.requestIsRefused;
            $scope.requestIsWaitingForValidation = agreementStatusInfo.requestIsWaitingForValidation;

            var cssClassesForStatuses = request.getCssClassesForStatus(req.agreementStatusCode);
            $scope.cssClassForOverallStatus = cssClassesForStatuses.cssClassForOverallStatus;
            $scope.cssClassForAgreementStatus = cssClassesForStatuses.cssClassForAgreementStatus;

            req.remainingVisas = request.computeRemainingVisas(req);

            request.request = req;
            $log.debug(request.request);
        });
    };

    request.getCssClassesForStatus = function(agreementStatusCode) {
        var cssClassForAgreementStatus = "primary";

        if (agreementStatusCode=='G') {
            cssClassForAgreementStatus = "success";
        } else if (agreementStatusCode=='R') {
            cssClassForAgreementStatus = "danger";
        }

        return {
            cssClassForOverallStatus: "label label-" + cssClassForAgreementStatus + " text-uppercase",
            cssClassForAgreementStatus: "label label-" + cssClassForAgreementStatus
        }
    };

    request.getRequestStatusInfo = function(agreementStatusCode) {
        return {
            requestIsGranted : agreementStatusCode=='G',
            requestIsRefused : agreementStatusCode=='R',
            requestIsWaitingForValidation : agreementStatusCode=='P'
        }
    };

    request.computeRemainingVisas = function(request) {

        if (request.agreementStatusCode!='P') {
            return [];
        }

        var requiredVisas = request.requiredAgreementVisas;
        var remainingVisas = [];
        var nextAgreementVisaRank = request.nextAgreementVisaRank;

        for (var i=nextAgreementVisaRank; i<requiredVisas.length; i++) {
            remainingVisas.push(requiredVisas[i]);
        }

        return remainingVisas;
    };

    request.getEmployees = function() {
        RequestModel.getEmployees().then(function(result) {
            request.selectedEmployee = result[0];
            request.employees = result;
        });
    };

    // =====================================================
    // Interaction with the view
    // =====================================================

    request.selectedEmployeeCanGrantOrDenyNextVisa = function() {
        return request.selectedEmployee.departmentCode == request.request.nextExpectedAgreementVisa.departmentCode
                && request.selectedEmployee.seniority >= request.request.nextExpectedAgreementVisa.seniority;
    };

    request.isVisaGranted = function(visa) {
        return visa.statusCode=='G';
    };

    request.isVisaDenied = function(visa) {
        return visa.statusCode=='D';
    };

    // =====================================================
    // Interaction with the view: grant/deny visa
    // =====================================================

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
            comment : 'Lorem ipsum : visa comment has to be implemented'
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