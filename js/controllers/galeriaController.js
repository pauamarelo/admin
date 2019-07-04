(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('galeriaCtrl', function($scope, $http, config, toaster) {
        const vm = this

        vm.dados = {}
        vm.img = {}
        vm.isLoading = false
        vm.imgIsLoading = false
        vm.isPostLoading = false

        // Paginate options
        vm.orderByField = '-createdAt'
        vm.reverseSort = false
        vm.pageSize = '12'
        vm.pagination = {
            current: 1
        }

        vm.scrollTop = function() {
            $('html, body').animate({scrollTop: $('.bloco').offset().top - 80}, 200)
        }

        // GET
        function listarIntegrantes() {
            $http.get(config.listarIntegrantes)
            .then(function(response) {
                vm.integrantes = response.data.data
            })
        }
        listarIntegrantes()

        function listar() {
            vm.isLoading = true
            $http.get(config.listarGaleria)
            .then(function(response) {
                if(response.data.status) {
                    vm.res = response.data
                    vm.galeria = response.data.data
                    vm.isLoading = false
                }
            })
        }
        listar()

        // Abre modal add
        vm.openAdd = function() {
            vm.dados = {}
            $('#modalAdd').modal('show')
        }
        // POST
        vm.adicionar = function(d) {
            vm.isPostLoading = true
            if(!d.imagem) {
                vm.imagem = ''
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                foto: vm.imagem,
                legenda: d.legenda,
                integrante: d.integrante
            }
            $http.post(config.galeria, objData)
            .then(function(response) {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    listar()
                    $('#modalAdd').modal('hide')
                    vm.isPostLoading = false
                } else {
                    toaster.error('Erro', 'Houve um erro.')
                    vm.isPostLoading = false
                }
            })
        }

        
        // Abre modal edit
        vm.openEdit = function(d) {
            vm.dados = d
            vm.img = {}
            $('#modalEdit').modal('show')
        }
        // PUT
        vm.editar = function(d) {
            vm.isPostLoading = true
            if(!d.imagem) {
                vm.imagem = d.foto
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                foto: vm.imagem,
                legenda: d.legenda,
                integrante: d.integrante
            }
            $http.put(`${config.galeria}/${d._id}`, objData)
            .then(function(response) {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    listar()
                    $('.modal').modal('hide')
                    vm.isPostLoading = false
                } else {
                    toaster.error('Erro', 'Houve um erro.')
                    vm.isPostLoading = false
                }
            })
        }

        // Ativo
        vm.ativo = function(post) {
            if(post.ativo) {
                post.ativo = 0
            } else {
                post.ativo = 1
            }
            vm.editar(post)
        }


        // DELETE
        vm.delete = function(d) {
            if(confirm('Você realmente deseja excluir este registro?')) {
                $http.delete(`${config.galeria}/${d._id}`)
                .then(function(response) {
                    if(response.data.status) {
                        toaster.success('Sucesso!', response.data.msg)
                        listar()
                    } else {
                        toaster.error('Erro', 'Houve um erro.')
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


        // Abrir modal Detalhes
        vm.detalhes = function(d) {
            vm.dados = d
            $('#modalDetalhes').modal('show')
        }
    })
})()