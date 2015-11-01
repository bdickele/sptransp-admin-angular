'use strict';

angular.module('SpTransp.Resources')
    .controller('ResourcesCtrl', ResourcesCtrl);

function ResourcesCtrl(MainModel) {
    var resources = this;

    resources.destinations = [];
    resources.goods = [];


    resources.getDestinations = function() {
        MainModel.getDestinations().then(function(result) {
            resources.destinations = result;
        });
    };

    resources.getGoods = function() {
        MainModel.getGoods().then(function(result) {
            resources.goods = result;
        });
    };

    resources.getDestinations();
    resources.getGoods();
}