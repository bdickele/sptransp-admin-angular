'use strict';

angular.module('SpTransp.Requests')
    .controller('RequestsCtrl', RequestsCtrl);

function RequestsCtrl($scope, $location, $routeParams, RequestsModel) {
    var requests = this;

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
        });
    };

    requests.selectRequest = function(requestReference) {
        $location.path('request/' + requestReference);
    };

    if (requests.searchType == 'beingValidated') requests.getRequestsBeingValidated();
    else if (requests.searchType == 'grantedOrRefused') requests.getRequestsGrantedOrRefused();

}