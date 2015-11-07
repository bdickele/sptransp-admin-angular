'use strict';

angular.module('SpTransp.Request')
    .controller('RequestCtrl', RequestCtrl);

function RequestCtrl($log, $routeParams, $route, $scope, RequestModel) {
    var request = this;

    request.reference = $routeParams['reference'];
    request.request = {};
    request.request.remainingVisas = [];

    request.employees =[];

    request.selectedEmployeeCanGrantOrDenyNextVisa = false;

    request.operation = {};

    $scope.requestIsGranted = false;
    $scope.requestIsRefused = false;
    $scope.requestIsWaitingForValidation = false;

    $scope.cssClassForOverallStatus = "";
    $scope.cssClassForAgreementStatus = "";

    $scope.showSubmissionErrorMsg = false;
    $scope.submissionErrorMsg = "";

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

            request.request = req;
            request.request.remainingVisas = request.computeRemainingVisas(req);

            request.operation.visa = req.nextExpectedAgreementVisa;

            request.updateWhatDependsOnRequestOrEmployee();
            //$log.debug(request.request);
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
            request.operation.employee = result[0];
            request.employees = result;
            request.updateWhatDependsOnRequestOrEmployee();
        });
    };

    // =====================================================
    // Interaction with the view
    // =====================================================

    request.updateWhatDependsOnRequestOrEmployee = function() {
        var visa = request.operation.visa;
        var employee = request.operation.employee;

        if (employee && visa) {
            request.selectedEmployeeCanGrantOrDenyNextVisa = request.canEmployeeGrantOrDenyVisa(employee, visa);
        }
    };

    request.selectedEmployeeHasChanged = function() {
        request.updateWhatDependsOnRequestOrEmployee();
    };

    request.canEmployeeGrantOrDenyVisa = function(employee, visa) {
        if (!employee || !visa) {
            return false;
        }

        return employee.departmentCode == visa.departmentCode && employee.seniority >= visa.seniority;
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
        request.operation.statusCode = 'G';
        request.applyVisa();
    };

    request.denyVisa = function() {
        request.operation.statusCode = 'D';
        request.applyVisa();
    };

    request.applyVisa = function() {
        var visa = {
            employeeUid : request.operation.employee.uid,
            statusCode : request.operation.statusCode,
            comment : request.operation.comment
        };
        RequestModel.grantOrDenyVisa(request.request.reference, visa)
            .then(function (result) {
                $route.reload();
                $scope.showSubmissionErrorMsg = false;
                $scope.submissionErrorMsg = "";
            }, function (reason) {
                $log.error('Could not apply visa', reason);
                $scope.showSubmissionErrorMsg = true;
                $scope.submissionErrorMsg = reason.data.error;
            });
    };

    request.getRequest(request.reference);
    request.getEmployees();
}