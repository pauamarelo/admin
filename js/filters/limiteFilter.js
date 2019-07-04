(function() {
    'use strict'

    const app = angular.module('myApp')

    app.filter('limite', function() {
        var caracteres = 65
        return function (input) {
            if (input.length <= caracteres) return input
            var output = input.substring(0,caracteres) + "..."
            return output
        }
    })
})()