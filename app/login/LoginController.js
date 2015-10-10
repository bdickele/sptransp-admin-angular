'use strict';

angular.module('SpTransp.Login')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($log, $rootScope, $scope, $http, $location, EndpointConfigService) {
    var login = this;

    $scope.credentials = {};

    $scope.signIn = function() {
        authenticate($scope.credentials, function() {
            if ($rootScope.authenticated) {
                $location.path("/employees");
                $scope.error = false;
            } else {
                $location.path("/login");
                $scope.error = true;
            }
        });
    };

    var authenticate = function(credentials, callback) {

        var headers = credentials ? {authorization : "Basic " +
            btoa(credentials.username + ":" + credentials.password)
        } : {};

        // We try to load a "user" resource from the back-end
        var url = EndpointConfigService.getUrl('user' + EndpointConfigService.getCurrentFormat());

        $http.get(url, {headers : headers}).success(function(data) {
            //$log.debug(data);
            if (data.name) {
                $rootScope.authenticated = true;
            } else {
                $rootScope.authenticated = false;
            }
            callback && callback();
        }).error(function() {
            $rootScope.authenticated = false;
            callback && callback();
        });
    }

    authenticate();
}
