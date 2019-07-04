(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('perfilCtrl', function($scope, $http, config, toaster, auth) {
        const vm = this

        vm.editar = function(d) {
            if(!d.imagem) {
                vm.imagem = d.img
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                nome: d.nome,
                sobrenome: d.sobrenome,
                login: d.login,
                senha: d.senha,
                confirmarSenha: d.confirmarSenha,
                styles: {
                    header: d.styles.header,
                    background: d.styles.background,
                    sidebar: d.styles.sidebar
                },
                foto: vm.imagem
            }
            $http.put(config.admins, objData)
            .then((response) => {
                if(confirm('Se salvar as alterações você será desconectado, necessitando fazer o login novamente.')) {
                    if(response.data.status) {
                        toaster.success('Sucesso!', response.data.msg)
                        auth.logout()
                    } else {
                        toaster.error('Erro', response.data.msg)
                    }
                }
            })
        }


        // Upload
        vm.upload = function(d) {
            vm.imgIsLoading = true
            const file = d
            let fd = new FormData()
            fd.append('imagem', file)
            $http.post(
                config.upload,
                fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            ).then(function (response) {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    vm.img = response.data
                    vm.imgIsLoading = false
                } else {
                    toaster.error('Erro', response.data.msg)
                    vm.imgIsLoading = false
                }
            })
            .catch(function(error) {
                toaster.error('Erro', 'Houve um erro')
                vm.imgIsLoading = false
            })
        }
    })
})()