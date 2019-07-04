(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('perfilCtrl', function($scope, $rootScope, $http, config, toaster, auth, $window) {
        const vm = this
        
        vm.dados = $rootScope.user
        vm.imgIsLoading = false

        vm.editar = function(d) {
            if(!d.imagem) {
                vm.imagem = d.foto
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                nome: d.nome,
                sobrenome: d.sobrenome,
                login: d.login,
                styles: {
                    header: d.styles.header,
                    background: d.styles.background,
                    sidebar: d.styles.sidebar,
                    headerLetters: d.styles.headerLetters,
                    backgroundLetters: d.styles.backgroundLetters,
                    sidebarLetters: d.styles.sidebarLetters
                },
                foto: vm.imagem
            }
            if(confirm('Salvar as alterações fará com que você seja desconectado, deseja salvar?')) {
                $http.put(`${config.admins}/${vm.dados._id}`, objData)
                .then((response) => {
                    if(response.data.status) {
                        toaster.success('Sucesso!', response.data.msg)
                        auth.logout()
                    } else {
                        toaster.error('Erro', response.data.msg)
                    }
                })
            }
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

        // Abre modal senha
        vm.openModalSenha = function() {
            $('#modalSenha').modal('show')
        }

        // Editar senha
        vm.editarSenha = function(d) {
            let objData = {
                senha: d.senha,
                confirmarSenha: d.confirmarSenha
            }
            if(confirm('Salvar as alterações fará com que você seja desconectado, deseja salvar?')) {
                $http.put(`${config.adminSenha}/${vm.dados._id}`, objData)
                .then((response) => {
                    toaster.success('Sucesso!', response.data.msg)
                    auth.logout()
                })
                .catch((response) => {
                    toaster.error('Erro', response.data.errors[0])
                })
            }
            // if(d.senha !== d.confirmarSenha) {
            //     alert('As senhas são diferentes!')
            // } else {
            //     if(confirm('Salvar as alterações fará com que você seja desconectado, deseja salvar?')) {
            //         $http.put(`${config.adminSenha}/${vm.dados._id}`, objData)
            //         .then((response) => {
            //             if(response.data.status) {
            //                 toaster.success('Sucesso!', response.data.msg)
            //                 auth.logout()
            //             } else {
            //                 toaster.error('Erro', response.data.msg)
            //             }
            //         })
            //     }
            // }
        }
    })
})()