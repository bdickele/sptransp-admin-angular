'use strict';

angular.module('SpTransp.Customers')
    .controller('CustomersCtrl', CustomersCtrl);

function CustomersCtrl($location, CustomersModel) {
    var customers = this;

    // List of all customers
    customers.list = [];


    // To get the complete list of customers
    customers.getAllCustomers = function() {
        CustomersModel.getCustomers().then(function(result) {
            customers.list = result;
        });
    };

    customers.selectCustomer = function(customer) {
        var destination = CustomersModel.getUrl() + customer.uid;
        $location.path(destination);
    };

    customers.createCustomer = function() {
        var destination = CustomersModel.getUrl() + "new";
        $location.path(destination);
    }

    customers.getAllCustomers();
}