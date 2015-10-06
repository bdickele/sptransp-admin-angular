'use strict';

angular.module("SpTransp.Employees")
    .service("EmployeesModel", function() {
        var service = this;

        service.all = function() {
            return [
                {
                    uid: "ABCD",
                    fullName: "John DOE",
                    departmentCode: "LAW_COMPLIANCE",
                    seniority: 60,
                    creationDate: "01/01/2016",
                    creationUser: "ADMIN"
                },
                {
                    uid: "ABCDE",
                    fullName: "John DOEEE",
                    departmentCode: "SHUTTLE_COMPLIANCE",
                    seniority: 80,
                    creationDate: "01/03/2016",
                    creationUser: "ADMIN2"
                }];
        };
    });