(function() {
    'use strict'

    const app = angular.module('myApp')

    app.controller('partidasCtrl', function($scope, $http, config, toaster) {
        const vm = this

        vm.dados = {}
        vm.isLoading = false
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
            $http.get(config.listarPartidas)
            .then(function(response) {
                if(response.data.status) {
                    vm.res = response.data
                    vm.partidas = response.data.data
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
            let objData = {
                map: d.map,
                status: d.status,
                clan_home: {
                    name: 'PAU AMARELO',
                    score: d.clan_home.score,
                    players: []
                },
                clan_away: {
                    name: d.clan_away.name,
                    score: d.clan_away.score,
                    players: []
                }
            }
            $http.post(config.partidas, objData)
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
            let objData = {
                map: d.map,
                status: d.status,
                clan_home: {
                    name: d.clan_home.name,
                    score: d.clan_home.score,
                    players: d.clan_home.players
                },
                clan_away: {
                    name: d.clan_away.name,
                    score: d.clan_away.score,
                    players: d.clan_away.players
                }
            }
            $http.put(`${config.partidas}/${d._id}`, objData)
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


        // DELETE
        vm.delete = function(d) {
            if(confirm('Você realmente deseja excluir este registro?')) {
                $http.delete(`${config.partidas}/${d._id}`)
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


        // Abrir modal Players
        vm.openPlayers = function(d, clan) {
            vm.dados = d
            vm.clan = clan
            $('#modalPlayers').modal('show')
        }
    })
})()