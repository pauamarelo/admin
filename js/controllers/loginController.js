(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('loginCtrl', function($rootScope, $http, config, toaster, auth, $timeout, $window) {
        const vm = this

        vm.isLogin = true

        vm.logar = function(d) {
            auth.login(d, err => {
                if(err) {
                    toaster.error('Erro', err[0])
                } else {
                    toaster.success('Sucesso!', 'Login efetuado com sucesso.')
                    $rootScope.logado = true
                }
            })
            // auth.login(d, err => err ? toaster.error('Erro', err[0]) : toaster.success('Sucesso!', 'Login efetuado com sucesso.'))
        }

        vm.cadastrar = function(d) {
            $http.post(config.signup, d)
            .then((response) => {
                console.log(response.data)
                toaster.success('Sucesso!', response.data)
                vm.dados = {}
                $timeout(() => {
                    $window.location.reload()
                }, 6000)
            })
            .catch((response) => {
                toaster.error('Erro', response.data.errors[0])
            })
        }
    })
})()