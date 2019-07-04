(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('headerCtrl', function($scope, $http) {
        const vm = this

        vm.status = {
            isCollapsed: true
        }
    })
})()