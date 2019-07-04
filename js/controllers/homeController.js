(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('homeCtrl', function($scope, $http) {
        const vm = this

        vm.msg = 'oiiii'
    })
})()