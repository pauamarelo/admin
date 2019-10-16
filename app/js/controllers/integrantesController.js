(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('integrantesCtrl', function($scope, $http, config, toaster) {
        const vm = this

        vm.dados = {}
        vm.img = {}
        vm.isLoading = false
        vm.imgIsLoading = false
        vm.isPostLoading = false

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
            $http.get(config.listarIntegrantes)
            .then(function(response) {
                if(response.data.status) {
                    vm.res = response.data
                    vm.integrantes = response.data.data
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
                nome: d.nome,
                sobrenome: d.sobrenome,
                nick: d.nick,
                curiosidades: d.curiosidades,
                steam: d.steam,
                foto: vm.imagem
            }
            $http.post(config.integrantes, objData)
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
                nome: d.nome,
                sobrenome: d.sobrenome,
                nick: d.nick,
                sobre: {
                    funcao: d.sobre.funcao,
                    mapa: d.sobre.mapa,
                    armas: d.sobre.armas,
                    amigao: d.sobre.amigao,
                    caracteristicas: d.sobre.caracteristicas,
                    carreira: d.sobre.carreira,
                    patente: d.sobre.patente,
                    motivo: d.sobre.motivo,
                    clan: d.sobre.clan,
                    atuacao: d.sobre.atuacao,
                    contribuicao: d.sobre.contribuicao
                },
                config: {
                    mouse: d.config.mouse,
                    pad: d.config.pad,
                    headset: d.config.headset,
                    keyboard: d.config.keyboard,
                    screen: d.config.screen
                },
                curiosidades: d.curiosidades,
                steam: d.steam,
                foto: vm.imagem,
                ativo: d.ativo,
                exIntegrante: d.exIntegrante
            }
            $http.put(`${config.integrantes}/${d._id}`, objData)
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

        // Ex-integrante
        vm.ex = function(player) {
            console.log(player)
            if(player.exIntegrante) {
                player.exIntegrante = 0
            } else {
                player.exIntegrante = 1
            }
        }


        // DELETE
        vm.delete = function(d) {
            if(confirm('Você realmente deseja excluir este registro?')) {
                $http.delete(`${config.integrantes}/${d._id}`)
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


        // Abrir modal Sobre
        vm.openSobre = function(d) {
            vm.dados = d
            $('#modalSobre').modal('show')
        }

        // Abrir modal Config
        vm.openConfig = function(d) {
            vm.dados = d
            $('#modalConfig').modal('show')
        }
    })
})()