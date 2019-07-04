(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('noticiasCtrl', function($scope, $http, config, toaster) {
        const vm = this

        vm.dados = {}
        vm.img = {}
        vm.isLoading = false
        vm.imgIsLoading = false

        // Paginate options
        vm.orderByField = '-createdAt'
        vm.reverseSort = false
        vm.pageSize = '10'
        vm.pagination = {
            current: 1
        }

        // GET
        function listar() {
            vm.isLoading = true
            $http.get(config.listarPosts)
            .then(function(response) {
                if(response.data.status) {
                    vm.res = response.data
                    vm.posts = response.data.data
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
            if(!d.imagem) {
                vm.imagem = null
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                titulo: d.titulo,
                conteudo: d.conteudo,
                autor: d.autor,
                url: d.url,
                img: vm.imagem,
                ativo: d.ativo
            }
            $http.post(config.posts, objData)
            .then(function(response) {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    listar()
                    $('#modalAdd').modal('hide')
                } else {
                    toaster.error('Erro', 'Houve um erro.')
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
            if(!d.imagem) {
                vm.imagem = d.img
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                titulo: d.titulo,
                conteudo: d.conteudo,
                autor: d.autor,
                url: d.url,
                img: vm.imagem,
                ativo: d.ativo
            }
            $http.put(`${config.posts}/${d._id}`, objData)
            .then(function(response) {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    listar()
                    $('#modalEdit').modal('hide')
                } else {
                    toaster.error('Erro', 'Houve um erro.')
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
                $http.delete(`${config.posts}/${d._id}`)
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