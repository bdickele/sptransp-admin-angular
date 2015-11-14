'use strict';

angular.module('SpTransp.Requests')
    .controller('RequestsCtrl', RequestsCtrl);

function RequestsCtrl($scope, $location, $routeParams, RequestsModel) {
    var requests = this;

    const TYPE_BEING_VALIDATED = 'beingValidated';
    const TYPE_GRANTED_OR_REFUSED = 'grantedOrRefused';

    $scope.itemsPerPageOptions = [10, 20, 40, 60];

    $scope.totalNbOfRequests = 0;
    $scope.totalNbOfPages = 0;
    $scope.nbOfElementsPerPage = $scope.itemsPerPageOptions[1];
    // Sur la dernier page le nombre d'elements affiches n'est pas forcement le
    // meme que le nombre d'elements par page
    $scope.nbOfElementsDisplayed = 0;
    $scope.currentPageIndex = 0;
    $scope.paginationLabel = "";

    requests.searchType = $routeParams['searchType'];

    requests.requests = [];
    $scope.title = "";


    $scope.getRange = function(size) {
        var array = new Array();
        for (var i=0; i<size; i++) {
            array.push(i+1);
        }
        return array;
    };

    requests.getRequestsBeingValidated = function() {
        $scope.title = "Requests being validated";
        RequestsModel.getRequestsBeingValidated($scope.nbOfElementsPerPage, $scope.currentPageIndex)
            .then(function(result) {
                requests.requests = requests.analyzePaginatedResult(result);
        });
    };

    requests.getRequestsGrantedOrRefused = function() {
        $scope.title = "Requests granted or refused";
        RequestsModel.getRequestsGrantedOrRefused($scope.nbOfElementsPerPage, $scope.currentPageIndex)
            .then(function(result) {
                requests.requests = requests.analyzePaginatedResult(result);
                requests.requests.sort(function(req1, req2) {
                        return req2.updateDateForComparison - req1.updateDateForComparison;
                    });
        });
    };

    requests.analyzePaginatedResult = function(result) {
        var listOfRequests = result[0];
        $scope.totalNbOfRequests = result[1];
        $scope.totalNbOfPages = result[3];
        $scope.nbOfElementsPerPage = result[4];
        $scope.currentPageIndex = result[5];
        $scope.nbOfElementsDisplayed = result[8];

        var indexOfFirstRequestDisplayed = $scope.currentPageIndex * $scope.nbOfElementsPerPage;
        var indexOfLastRequestDisplayed = indexOfFirstRequestDisplayed + $scope.nbOfElementsDisplayed;

        $scope.paginationLabel = (indexOfFirstRequestDisplayed + 1) + " - "
            + indexOfLastRequestDisplayed + " of " + $scope.totalNbOfRequests;

        return listOfRequests;
    };

    requests.loadRequests = function() {
        if (requests.searchType == TYPE_BEING_VALIDATED) requests.getRequestsBeingValidated();
        else if (requests.searchType == TYPE_GRANTED_OR_REFUSED) requests.getRequestsGrantedOrRefused();
        else $location.path('requests/' + TYPE_BEING_VALIDATED);
    };

    $scope.changePage = function(pageIndex) {
        $scope.currentPageIndex = pageIndex;
        requests.loadRequests();
    }

    $scope.changeItemsPerPage = function(itemPerPage) {
        $scope.currentPageIndex = 0;
        $scope.nbOfElementsPerPage = itemPerPage;
        requests.loadRequests();
    };

    $scope.selectRequest = function(requestReference) {
        $location.path('request/' + requestReference);
    };

    $scope.isRequestWaitingForValidation = function(request) {
        return request.agreementStatusCode=='P';
    };

    $scope.getAgreementStatusCssClass = function(request) {
        var mapAgreementStatusCodeCssClass = {
            'C' : 'label label-danger',
            'P' : 'label label-primary',
            'G' : 'label label-success',
            'R' : 'label label-danger'
        };

        return mapAgreementStatusCodeCssClass[request.agreementStatusCode];
    };

    requests.loadRequests();
}