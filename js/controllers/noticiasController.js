(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('noticiasCtrl', function($scope, $http, config, toaster, auth) {
        validateUser()
        const vm = this
        const user = auth.getUser()

        vm.dados = {}
        vm.img = {}
        vm.isLoading = false
        vm.imgIsLoading = false
        vm.isPostLoading = false
        vm.fullName = `${user.nome} "${user.login}" ${user.sobrenome}`

        // Validação do token
        function validateUser() {
            const user = auth.getUser()

            if (!user) {
                console.log('Usuário inválido')
            } else if (user && !user.isValid) {
                auth.validateToken(user.token, (err, valid) => {
                    if (!valid) {
                        console.log('Token inválido')
                    } else {
                        listarAdmins()
                    }
                })
            }
        }

        // Listar admins
        function listarAdmins() {
            $http.get(config.admins)
            .then((response) => {
                vm.admins = response.data.data
            })
        }

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
            $http.get(config.listNews)
            .then((response) => {
                if(response.data.status) {
                    vm.res = response.data
                    vm.news = response.data.data
                    vm.isLoading = false
                }
            })
            .catch((error) => {
                vm.res = error.data
                vm.isLoading = false
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
                titulo: d.titulo,
                conteudo: d.conteudo,
                autor: d.autor,
                url: d.titulo.replace(/\W+/g, '-').toLowerCase(),
                img: vm.imagem,
                ativo: d.ativo
            }
            $http.post(config.news, objData)
            .then((response) => {
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
                vm.imagem = d.img
            } else {
                vm.imagem = vm.img.data.filePath
            }
            let objData = {
                titulo: d.titulo,
                conteudo: d.conteudo,
                autor: d.autor,
                url: d.titulo.replace(/\W+/g, '-').toLowerCase(),
                img: vm.imagem,
                ativo: d.ativo
            }
            $http.put(`${config.news}/${d._id}`, objData)
            .then((response) => {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    listar()
                    $('#modalEdit').modal('hide')
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
                $http.delete(`${config.news}/${d._id}`)
                .then((response) => {
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
            ).then((response) => {
                if(response.data.status) {
                    toaster.success('Sucesso!', response.data.msg)
                    vm.img = response.data
                    vm.imgIsLoading = false
                } else {
                    toaster.error('Erro', response.data.msg)
                    vm.imgIsLoading = false
                }
            })
            .catch((error) => {
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