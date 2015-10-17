'use strict';

angular.module('SpTransp.Customer')
    .controller('CustomerCtrl', CustomerCtrl);

function CustomerCtrl($log, $routeParams, $location, CustomerModel, CustomersModel) {
    var customer = this;
    var customerUid = $routeParams['uid'];

    customer.currentCustomer = {};
    customer.editedCustomer = {};

    customer.title = "";
    customer.creationMode = false;

    if (customerUid == "new") customer.creationMode = true;


    customer.initNewEmployee = function() {
        customer.currentCustomer['fullName'] = '';
        customer.editedCustomer = angular.copy(customer.currentCustomer);
        customer.title = "New customer";
    };

    customer.retrieveCustomer = function() {
        CustomerModel.getCustomer(customerUid)
            .then(function(result) {
                customer.currentCustomer = result.data;
                customer.editedCustomer = angular.copy(customer.currentCustomer);
                customer.title = "Customer " + customer.currentCustomer.fullName;
            }, function(reason) {
                $log.error("Could not retrieve customer with uid " + customerUid + " : " + reason);
            });
    };

    // When cancelling : in creation mode we go back to list of customers
    customer.cancel = function() {
        customer.resetForm();
        $location.path(CustomersModel.getUrl());
    }

    customer.resetForm = function() {
        customer.editedCustomer = angular.copy(customer.currentCustomer);
        customer.formCustomer.$setPristine();
        customer.formCustomer.$setUntouched();
    };

    customer.update = function() {
        CustomerModel.updateCustomer(customerUid, customer.editedCustomer)
            .then(function (result) {
                $location.path(CustomersModel.getUrl());
            }, function (reason) {
                $log.error('Could not save customer', reason);
            });
    }

    customer.create = function(addAnotherOne) {
        CustomerModel.createCustomer(customer.editedCustomer)
            .then(function (result) {
                if (!addAnotherOne) {
                    $location.path(CustomersModel.getUrl());
                } else {
                    customer.initNewEmployee();
                }
            }, function (reason) {
                $log.error('Could not create customer', reason);
            });
    };

    customer.save = function(addAnotherOne) {
        var fields = ['uid', 'fullName'];

        fields.forEach(function (field) {
            customer.currentCustomer[field] = customer.editedCustomer[field]
        });

        // Creation of a new customer
        if (customer.creationMode) {
            customer.create(addAnotherOne);
        } else {
            customer.update();
        }
    };

    if (customer.creationMode) {
        customer.initNewEmployee();
    } else {
        customer.retrieveCustomer();
    }
};
