(function() {
    'use strict'

    const app = angular.module('myApp')

    const api = 'https://pauamarelo.herokuapp.com/api/'
    const oapi = 'https://pauamarelo.herokuapp.com/oapi/'

    app.constant('config', {
        userKey: '_nodejs_mongodb',
        listNews: oapi+'news',
        news: api+'news',
        upload: api+'upload',
        login: oapi+'login',
        signup: oapi+'signup',
        validateToken: oapi+'validateToken',
        admins: api+'admins',
        adminSenha: api+'adminSenha',
        listarIntegrantes: oapi+'integrantes',
        integrantes: api+'integrantes',
        listarGaleria: oapi+'galeria',
        galeria: api+'galeria'
    })
})()