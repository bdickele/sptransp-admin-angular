'use strict';

angular.module('SpTransp.Requests')
    .controller('RequestsCtrl', RequestsCtrl);

function RequestsCtrl($scope, $location, $routeParams, RequestsModel) {
    var requests = this;

    const TYPE_BEING_VALIDATED = 'beingValidated';
    const TYPE_GRANTED_OR_REFUSED = 'grantedOrRefused';

    requests.searchType = $routeParams['searchType'];

    requests.requests = [];
    $scope.title = "";

    requests.getRequestsBeingValidated = function() {
        $scope.title = "Requests being validated";
        RequestsModel.getRequestsBeingValidated().then(function(result) {
            requests.requests = result;
        });
    };

    requests.getRequestsGrantedOrRefused = function() {
        $scope.title = "Requests granted or refused";
        RequestsModel.getRequestsGrantedOrRefused().then(function(result) {
            requests.requests = result;
            requests.requests.sort(function(req1, req2) {
                    return req2.updateDateForComparison - req1.updateDateForComparison;
                });
        });
    };

    requests.selectRequest = function(requestReference) {
        $location.path('request/' + requestReference);
    };

    requests.isRequestWaitingForValidation = function(request) {
        return request.agreementStatusCode=='P';
    };

    requests.getAgreementStatusCssClass = function(request) {
        var mapAgreementStatusCodeCssClass = {
            'C' : 'label label-danger',
            'P' : 'label label-primary',
            'G' : 'label label-success',
            'R' : 'label label-danger'
        };

        return mapAgreementStatusCodeCssClass[request.agreementStatusCode];
    };

    if (requests.searchType == TYPE_BEING_VALIDATED) requests.getRequestsBeingValidated();
    else if (requests.searchType == TYPE_GRANTED_OR_REFUSED) requests.getRequestsGrantedOrRefused();
    else $location.path('requests/' + TYPE_BEING_VALIDATED);

}